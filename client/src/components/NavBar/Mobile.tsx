import { Flex } from "@chakra-ui/layout";
import { Box, IconButton } from "@chakra-ui/react";
import React from "react";
import { GiOctopus } from "react-icons/gi";
import { NavCategory } from "../../types/navCategories";
import SearchButton from "../SearchButton";
import { MobileDrawer } from "./MobileDrawer";
import NextLink from "next/link";
import { BsBag } from "react-icons/bs";
import { useAppSelector } from "../../redux/hooks";

interface MobileNavProps {
  categories: NavCategory[];
}

export const MobileNav: React.FC<MobileNavProps> = ({ categories }) => {
  const { cart } = useAppSelector((state) => state);

  return (
    <Flex w={"100%"} h={"4em"} backgroundColor={"teal"}>
      <Flex ml={2} w={"100%"} alignItems={"center"}>
        <MobileDrawer categories={categories} />
      </Flex>
      <Flex h={"4em"} alignItems={"center"}>
        <GiOctopus size={40} color={"white"} />
      </Flex>
      <Flex h={"4em"} w={"100%"} alignItems={"center"} justifyContent={"end"}>
        <Box ml={"auto"} mr={2}>
          <SearchButton />
        </Box>

        <NextLink href={"/cart"}>
          <Box position={"relative"} mr={2}>
            <IconButton
              colorScheme={
                cart.value.cartItems
                  ?.map((item) => item.quantity)
                  .reduce((partialSum, a) => partialSum + a, 0) > 0
                  ? "teal"
                  : "teal"
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
