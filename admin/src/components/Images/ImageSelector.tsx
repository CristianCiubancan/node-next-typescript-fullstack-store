import { CheckIcon } from "@chakra-ui/icons";
import { Box, Flex, Image } from "@chakra-ui/react";
import { Img } from "../../types/product";

interface ImageSelectorProps {
  images: Img[];
  selectedPhotos: Img[];
  setSelectedPhotos: React.Dispatch<React.SetStateAction<Img[]>>;
}

const ImageSelector: React.FC<ImageSelectorProps> = ({
  images,
  selectedPhotos,
  setSelectedPhotos,
}) => {
  return (
    <Box w={"100%"}>
      <Box height={"100%"}>
        <Flex flexWrap={"wrap"}>
          {images.map((image: Img) => {
            const isImageSelected = selectedPhotos.filter(
              (photo) => photo.id === image.id
            )[0];

            return (
              <Box key={image.name}>
                <Box
                  cursor={"pointer"}
                  m={1}
                  p={1}
                  backgroundColor={isImageSelected ? "blue.300" : "white"}
                  onClick={() => {
                    if (isImageSelected) {
                      setSelectedPhotos([
                        ...selectedPhotos.filter(
                          (photo) => photo.id !== image.id
                        ),
                      ]);
                    } else {
                      setSelectedPhotos([...selectedPhotos, image]);
                    }
                  }}>
                  <Box backgroundColor={"white"} position={"relative"}>
                    <Image
                      width={100}
                      height={100}
                      objectFit={"cover"}
                      src={
                        image.sizes!.filter((size) => size.width === 150)[0]
                          ?.url
                      }
                    />
                    {isImageSelected ? (
                      <Box
                        position={"absolute"}
                        bottom={0}
                        right={0}
                        paddingLeft={1.5}
                        backgroundColor={"blue.300"}>
                        <CheckIcon color={"white"} />
                      </Box>
                    ) : null}
                  </Box>
                </Box>
              </Box>
            );
          })}
        </Flex>
      </Box>
    </Box>
  );
};

export default ImageSelector;
