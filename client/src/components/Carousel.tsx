import { AspectRatio, Box, Flex, IconButton, Image } from "@chakra-ui/react";
import React, { useState } from "react";
import { CgZoomIn, CgZoomOut } from "react-icons/cg";
import { GrPowerReset } from "react-icons/gr";
import { TransformComponent, TransformWrapper } from "react-zoom-pan-pinch";
import { Img } from "../types/product";
import { getScreenSize } from "../utils/getScreenSize";
import CarouselThumbs from "./CarouselThumbs";

interface CarouselProps {
  images: Img[];
}

const Carousel: React.FC<CarouselProps> = ({ images }) => {
  const screenSize = getScreenSize();

  const [slideIndex, setSlideIndex] = useState(1);

  const moveDot = (index: number) => {
    setSlideIndex(index);
  };

  return (
    <Flex
      flexDirection={"column"}
      h={"100%"}
      alignItems={"center"}
      maxW="100%"
      w={500}>
      <Box maxW="100%" w={500} h={[300, 500]} position={"relative"}>
        <Box
          maxW="100%"
          minH="100%"
          w={500}
          h={[300, 500]}
          position={"absolute"}
          top={0}
          left={0}
          objectFit={"cover"}>
          <TransformWrapper initialScale={1} wheel={{ disabled: true }}>
            {({ zoomIn, zoomOut, resetTransform, ...rest }) => (
              <React.Fragment>
                <Flex
                  flexDirection={"column"}
                  position={"absolute"}
                  left={0}
                  top={0}
                  zIndex={1}
                  p={1}>
                  <IconButton
                    aria-label="Search database"
                    icon={<CgZoomIn />}
                    onClick={() => zoomIn()}
                    mb={1}
                  />
                  <IconButton
                    aria-label="Search database"
                    icon={<CgZoomOut />}
                    onClick={() => zoomOut()}
                    mb={1}
                  />
                  <IconButton
                    aria-label="Search database"
                    icon={<GrPowerReset />}
                    onClick={() => resetTransform()}
                  />
                </Flex>

                <TransformComponent>
                  <Image
                    maxW="100%"
                    minH="100%"
                    w={500}
                    h={[300, 500]}
                    backgroundPosition={"center"}
                    backgroundRepeat={"no-repeat"}
                    backgroundSize={"cover"}
                    onLoad={() => {
                      resetTransform();
                    }}
                    filter={"auto"}
                    fallbackSrc={images[slideIndex - 1]?.placeholderUrl}
                    objectFit={"cover"}
                    src={images[slideIndex - 1]?.url}
                  />
                </TransformComponent>
              </React.Fragment>
            )}
          </TransformWrapper>
        </Box>
      </Box>
      {images.length > 1 ? (
        <Box maxW="100%" w={[500]}>
          <CarouselThumbs containerName="carouselThumbs">
            {images.length > 1 &&
              images?.map((image, index) => (
                <Box
                  p={1}
                  key={index}
                  backgroundColor={
                    index + 1 === slideIndex ? "teal.600" : "white"
                  }
                  my={2}>
                  <AspectRatio ratio={1} backgroundColor={"white"} w={20}>
                    <Image
                      onClick={() => moveDot(index + 1)}
                      borderWidth={index + 1 === slideIndex ? "1px" : "0px"}
                      objectFit={"cover"}
                      src={
                        image.sizes.filter((size) => size.width === 150)[0]?.url
                      }
                      cursor={"pointer"}
                    />
                  </AspectRatio>
                </Box>
              ))}
          </CarouselThumbs>
        </Box>
      ) : null}
    </Flex>
  );
};

export default Carousel;
