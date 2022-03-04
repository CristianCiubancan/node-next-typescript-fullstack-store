import { Flex } from "@chakra-ui/layout";
import {
  Accordion,
  AccordionButton,
  AccordionItem,
  Box,
  IconButton,
  useOutsideClick,
} from "@chakra-ui/react";
import NextLink from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { BsBag } from "react-icons/bs";
import { GiOctopus } from "react-icons/gi";
import { useAppSelector } from "../../redux/hooks";
import { NavCategory } from "../../types/navCategories";
import SearchButton from "../SearchButton";
import { DesktopAccordionWithChildrenComponent } from "./DesktopAccordionWithChildrenComponent";

interface DesktopNavProps {
  categories: NavCategory[];
}

export const DesktopNav: React.FC<DesktopNavProps> = ({ categories }) => {
  const router = useRouter();

  const { cart } = useAppSelector((state) => state);

  const [categoryElements, setCategoryElements] = useState<any>();
  const [accordionIndex, setAccordionIndex] = useState<number>(-1);

  const ref = React.useRef();

  useOutsideClick({
    ref: ref as any,
    handler: () => setAccordionIndex(-1),
  });

  useEffect(() => {
    setAccordionIndex(-1);
  }, [router.query]);

  const recursiveBuild = (categories: any[]) => {
    return categories.map((category) => {
      if (category.subCategory?.length > 0) {
        return (
          <DesktopAccordionWithChildrenComponent
            key={category.id}
            category={category}>
            <Accordion allowToggle>
              {recursiveBuild(category.subCategory)}
            </Accordion>
          </DesktopAccordionWithChildrenComponent>
        );
      } else {
        return (
          <AccordionItem key={category.id} border="none">
            <h2>
              <AccordionButton
                fontSize={16}
                fontWeight={"normal"}
                px={2}
                whiteSpace={"nowrap"}
                onClick={(e) => {
                  e.preventDefault();
                  router.push(`/store?categoryId=${category.id}`);
                }}
                overflow={"hidden"}
                textOverflow={"ellipsis"}>
                <Box flex="1" textAlign="left">
                  {category.name}
                </Box>
              </AccordionButton>
            </h2>
          </AccordionItem>
        );
      }
    });
  };

  useEffect(() => {
    setCategoryElements(recursiveBuild(categories));
  }, []);

  return (
    <Flex justifyContent={"space-between"} w="full" px={10}>
      <Flex h={"4em"} w={"100%"} alignItems={"center"}>
        <GiOctopus size={40} color={"white"} />
      </Flex>

      <Flex
        backgroundColor={"purple.600"}
        justifyContent={"space-between"}
        alignItems={"center"}
        minH={"4em"}>
        {categories ? (
          <Accordion
            ref={ref as any}
            p={2}
            allowToggle
            backgroundColor={"purple.600"}
            index={accordionIndex}
            textColor={"white"}
            onChange={(e: number) => {
              setAccordionIndex(e);
            }}>
            <Flex>{categoryElements}</Flex>
          </Accordion>
        ) : null}
      </Flex>
      <Flex h={"4em"} w={"100%"} alignItems={"center"} justifyContent={"end"}>
        <Box ml={"auto"} mr={2}>
          <SearchButton />
        </Box>

        <NextLink href={"/cart"}>
          <Box position={"relative"}>
            <IconButton
              colorScheme={
                cart.value.cartItems
                  ?.map((item) => item.quantity)
                  .reduce((partialSum, a) => partialSum + a, 0) > 0
                  ? "purple"
                  : "purple"
              }
              aria-label="Call Segun"
              size="md"
              icon={<BsBag />}
            />
            {cart.value.cartItems
              ?.map((item) => item.quantity)
              .reduce((partialSum, a) => partialSum + a, 0) > 0 ? (
              <Flex
                justifyContent={"center"}
                alignItems={"center"}
                position={"absolute"}
                top={-2}
                right={-2}
                boxSize={5}
                p={2}
                color={"white"}
                fontWeight={"semibold"}
                backgroundColor={"red"}
                borderRadius={"full"}>
                {cart.value.cartItems
                  ?.map((item) => item.quantity)
                  .reduce((partialSum, a) => partialSum + a, 0)}
              </Flex>
            ) : null}
          </Box>
        </NextLink>
      </Flex>
    </Flex>
  );
};
