import { S3 } from "aws-sdk";
import express from "express";
import { getConnection } from "typeorm";
import { Req } from "../../types/networkingTypes";
import { DatabaseImage } from "./uploadImages";

const s3 = new S3({
  region: process.env.AWS_BUCKET_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_KEY,
});

const handleDeleteImages = async (req: Req, res: express.Response) => {
  const imagesToDelete: DatabaseImage[] = req.body;

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

  if (imagesToDelete.length === 0) {
    return res.json({ error: "no images provided" });
  }

  try {
    for (let dbImage of imagesToDelete) {
      const getUploadedImages = await s3
        .listObjects({
          Bucket: process.env.AWS_BUCKET_NAME,
          Prefix: `media/${dbImage.name}`,
        })
        .promise();
      if (getUploadedImages.Contents) {
        for (let image of getUploadedImages.Contents) {
          await s3
            .deleteObject({
              Bucket: process.env.AWS_BUCKET_NAME,
              Key: `${image.Key}`,
            })
            .promise();
        }
      }
    }
  } catch (err) {
    return res.json({
      error: err.code,
    });
  }

  const imagesToDeleteIds = imagesToDelete.map((image) => image.id);

  await getConnection()
    .query(
      `
        DELETE FROM image
        WHERE id = ANY ($1);
    `,
      [imagesToDeleteIds]
    )
    .catch((err) => {
      return res.json({
        error: err.code,
      });
    });

  return res.json("success");
};

export default handleDeleteImages;
