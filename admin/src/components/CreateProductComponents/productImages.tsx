import { Box, Button, Flex, Heading, Image } from "@chakra-ui/react";
import React, { useEffect } from "react";
import { setCreateProductImages } from "../../redux/features/products/createProduct";
import { setEditProductImages } from "../../redux/features/products/editProduct";
import { useAppDispatch } from "../../redux/hooks";
import { Img } from "../../types/product";
import ImageSelector from "../Images/ImageSelector";

interface ProductImagesProps {
  images: Img[];
  task: string;
  productImages: Img[];
  displayImageSelector: boolean;
  setProductImages: React.Dispatch<React.SetStateAction<Img[]>>;
  setDisplayImageSelector: React.Dispatch<React.SetStateAction<boolean>>;
}

const ProductImages: React.FC<ProductImagesProps> = ({
  images,
  productImages,
  task,
  displayImageSelector,
  setProductImages,
  setDisplayImageSelector,
}) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (task === "create") dispatch(setCreateProductImages(productImages));
    else dispatch(setEditProductImages(productImages));
  }, [productImages]);

  return (
    <Box m={2}>
      <Flex flexWrap={"wrap"}>
        {productImages?.map((image) => {
          return (
            <Box key={image.name} m={2} position={"relative"}>
              <Image
                src={image.sizes.filter((size) => size.width === 150)[0]?.url}
                w={100}
                objectFit={"cover"}
                h={100}
                fallbackSrc={image?.placeholderUrl}
              />
              <Button
                size={"xs"}
                colorScheme={"red"}
                top={-2}
                right={-2}
                borderRadius={"full"}
                position={"absolute"}
                onClick={() => {
                  setProductImages(
                    [...productImages].filter(
                      (stateImage) => image.id !== stateImage.id
                    )
                  );
                }}>
                X
              </Button>
            </Box>
          );
        })}
      </Flex>
      {displayImageSelector ? (
        <Box>
          <Box
            backgroundColor={"gray"}
            position={"fixed"}
            opacity={"0.1"}
            onClick={() => {
              setDisplayImageSelector(false);
            }}
            zIndex={2}
            p={20}
            inset={0}></Box>
          <Flex
            inset={5}
            flexDirection={"column"}
            overflowY={"scroll"}
            position={"fixed"}
            backgroundColor={"white"}
            zIndex={3}
            opacity={100}>
            <Flex justifyContent={"flex-end"} w={"100%"}>
              <Button
                m={2}
                position={"sticky"}
                borderRadius={0}
                colorScheme={"red"}
                onClick={() => {
                  setDisplayImageSelector(false);
                }}>
                X
              </Button>
            </Flex>
            <Box px={4} pb={4}>
              <ImageSelector
                setSelectedPhotos={setProductImages}
                selectedPhotos={productImages}
                images={images}
              />
            </Box>
          </Flex>
        </Box>
      ) : null}
      <Button
        mt={2}
        w={"100%"}
        colorScheme={"orange"}
        onClick={() => {
          setDisplayImageSelector(true);
        }}>
        Add product image
      </Button>
    </Box>
  );
};

export default ProductImages;
