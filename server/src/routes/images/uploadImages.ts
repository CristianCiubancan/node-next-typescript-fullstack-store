import express from "express";
import { v4 } from "uuid";
import { Req } from "../../types/networkingTypes";
import { S3 } from "aws-sdk";
import sharp from "sharp";
import { getConnection } from "typeorm";
import { Image } from "../../entities/Image/Image";
import { ImageSize } from "../../entities/Image/ImageSize";

interface ClientImage {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  buffer: Buffer;
  size: number;
}

interface UploadedImage {
  imageName: string;
  imageUrl: string;
  placeholderUrl?: string;
  size?: number;
  sizes?: UploadedImage[];
}

export interface DatabaseImage {
  id: number;
  name: string;
  url: string;
  parentImageId?: number;
  width?: number;
}

const s3 = new S3({
  region: process.env.AWS_BUCKET_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_KEY,
});

const handleUploadImages = async (req: Req, res: express.Response) => {
  if (!req.files) {
    return res.json({ error: "no images provided" });
  }

  if (!req.session.userId) {
    return res.json({
      error: "Your session expired, please relog",
    });
  }

  if (!req.session.isAdmin) {
    return res.json({
      error:
        "You are not authorized for this action, plase contact your supervisor",
    });
  }

  const handleImageProcessing = async (
    image: ClientImage,
    imageId: string,
    width?: number,
    isPlaceholder: boolean = false
  ) => {
    const resizedPic = !width
      ? isPlaceholder
        ? await sharp(image.buffer)
            .resize({
              fit: sharp.fit.contain,
              width: 1024,
            })

            .rotate()
            .webp({ quality: 1 })
            .blur(30)
            .toBuffer()
        : await sharp(image.buffer).rotate().webp({ quality: 70 }).toBuffer()
      : await sharp(image.buffer)
          .resize({
            fit: sharp.fit.contain,
            width,
          })
          .rotate()
          .webp({ quality: 70 })
          .toBuffer();

    const s3UploadedPic = await s3
      .upload({
        Bucket: process.env.AWS_BUCKET_NAME,
        Body: resizedPic as Buffer,
        Key: `media/${imageId}/${imageId}_${
          width ? width : isPlaceholder ? "placeholder" : "default"
        }`,
        ContentType: image.mimetype,
        BucketKeyEnabled: true,
        ACL: "public-read",
      })
      .promise();

    return s3UploadedPic;
  };

  const images: ClientImage[] = req.files as ClientImage[];

  const widths: number[] = [150, 300, 500, 1024];

  let uploadedImages: UploadedImage[] = [];

  try {
    for (let imageIdx in images) {
      const imageId = v4();
      const defaultImage = await handleImageProcessing(
        images[imageIdx],
        imageId
      );
      const defaultImagePlaceholder = await handleImageProcessing(
        images[imageIdx],
        imageId,
        undefined,
        true
      );

      uploadedImages.push({
        imageName: `${imageId}`,
        imageUrl: defaultImage.Location,
        placeholderUrl: defaultImagePlaceholder.Location,
        sizes: [],
      });

      for (let width of widths) {
        const resizedImage = await handleImageProcessing(
          images[imageIdx],
          imageId,
          width
        );
        uploadedImages[imageIdx].sizes?.push({
          imageName: `${imageId}_${width}`,
          imageUrl: resizedImage.Location,
          size: width,
        });
      }
    }
  } catch (err) {
    return res.json({
      error: JSON.stringify(err.message),
    });
  }

  let storedImages: any = [];

  const dbStoredImages = await getConnection()
    .createQueryBuilder()
    .insert()
    .into(Image)
    .values(
      uploadedImages.map((image) => {
        return {
          name: image.imageName,
          url: image.imageUrl,
          placeholderUrl: image.placeholderUrl,
        };
      })
    )
    .returning("*")
    .execute()
    .catch((err) => {
      return res.json({
        error: err.code,
      });
    });

  storedImages = (dbStoredImages as any).generatedMaps;

  let imageSizesToStore: string[] = [];

  uploadedImages.forEach((image: UploadedImage) => {
    image.sizes?.forEach((size: UploadedImage) => {
      imageSizesToStore.push(
        `('${size.imageName}', ${size.size}, '${size.imageUrl}', ${
          storedImages.filter(
            (storedImage: DatabaseImage) => storedImage.name === image.imageName
          )[0].id
        })`
      );
    });
  });

  let storedImageSizes: any = [];

  const dbStoredImageSizes = await getConnection()
    .createQueryBuilder()
    .insert()
    .into(ImageSize)
    .values(
      uploadedImages
        .map((image: UploadedImage) => {
          return image.sizes!.map((size: UploadedImage) => {
            return {
              name: size.imageName,
              width: size.size,
              url: size.imageUrl,
              parentImageId: storedImages.filter(
                (storedImage: DatabaseImage) =>
                  storedImage.name === image.imageName
              )[0].id,
            } as ImageSize;
          });
        })
        .flat()
    )
    .returning("*")
    .execute()
    .catch((err) => {
      return res.json({
        error: err.code,
      });
    });

  storedImageSizes = (dbStoredImageSizes as any).generatedMaps;

  let responseData: DatabaseImage[] = storedImages.map(
    (image: DatabaseImage) => {
      return {
        ...image,
        sizes: storedImageSizes.filter(
          (imageSize: DatabaseImage) => imageSize.parentImageId === image.id
        ),
      };
    }
  );

  return res.json(responseData);
};

export default handleUploadImages;
