import { Box, Flex, IconButton } from "@chakra-ui/react";
import React, { MutableRefObject, useEffect, useRef, useState } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

interface CarouselThumbsProps {
  containerName: string;
}
const CarouselThumbs: React.FC<CarouselThumbsProps> = ({
  children,
  containerName,
}) => {
  const [scrollLeft, setScrollLeft] = useState<number>(0);

  const [scrollWidth, setScrollWidth] = useState<number>(0);

  const [componentWidth, setComponentWidth] = useState<number>(0);

  const elementRef: MutableRefObject<HTMLElement | null> = useRef(null);

  const handleScroll = () => {
    const position = document.getElementById(containerName)?.scrollLeft;
    if (position) setScrollLeft(position);
  };

  useEffect(() => {
    document
      .getElementById(containerName)
      ?.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      document
        .getElementById(containerName)
        ?.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    if (elementRef && elementRef.current) {
      setScrollWidth(elementRef.current.scrollWidth);
    }
  }, []);

  useEffect(() => {
    const resizeObserver = new ResizeObserver((_entries) => {
      if (elementRef && elementRef.current) {
        setComponentWidth(elementRef.current.clientWidth);
        setScrollWidth(elementRef.current.scrollWidth);
      }
    });
    if (elementRef && elementRef.current) {
      resizeObserver.observe(elementRef.current);
    }

    return () => resizeObserver.disconnect();
  }, []);

  return (
    <Box position={"relative"} w={"100%"}>
      <Flex
        ref={elementRef as any}
        id={containerName}
        zIndex={1}
        // can be scroll but might not look the best
        // overflow={"scroll"}
        overflow={"hidden"}
        alignItems={"flex-start"}>
        {children}
      </Flex>
      {scrollLeft > 3 ? (
        <IconButton
          position={"absolute"}
          ml={2}
          top={"50%"}
          aria-label={"chevron left"}
          transform={"translateY(-50%)"}
          borderRadius={"full"}
          icon={<FiChevronLeft />}
          onClick={() => {
            document
              .getElementById(containerName)!
              .scrollBy({ left: -componentWidth / 2, behavior: "smooth" });

            setScrollLeft(document.getElementById(containerName)!.scrollLeft);
          }}
        />
      ) : null}

      {scrollLeft + componentWidth < scrollWidth ? (
        <IconButton
          position={"absolute"}
          right={0}
          mr={2}
          aria-label={"chevron right"}
          top={"50%"}
          transform={"translateY(-50%)"}
          borderRadius={"full"}
          icon={<FiChevronRight />}
          onClick={() => {
            document
              .getElementById(containerName)!
              .scrollBy({ left: componentWidth / 2, behavior: "smooth" });

            setScrollLeft(document.getElementById(containerName)!.scrollLeft);
          }}
        />
      ) : null}
    </Box>
  );
};

export default CarouselThumbs;
