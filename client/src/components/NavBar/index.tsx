import { Box, Flex } from "@chakra-ui/layout";
import { useToast } from "@chakra-ui/react";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import GetNavCategoriesOperation from "../../operations/category/getNavCategories";
import { setCategories } from "../../redux/features/categories/categoriesSlice";
import { setNavCategories } from "../../redux/features/navCategories/navCategoriesSlice";
import { useAppSelector } from "../../redux/hooks";
import { NavCategory } from "../../types/navCategories";
import { getScreenSize } from "../../utils/getScreenSize";
import { DesktopNav } from "./Desktop";
import { MobileNav } from "./Mobile";

interface NavBarProps {}

export const NavBar: React.FC<NavBarProps> = ({}) => {
  const { width: screenWidth } = getScreenSize();

  const toast = useToast();

  const {
    navCategories: { value: navCategories },
    categories: { value: categories },
  } = useAppSelector((state) => state);

  const dispatch = useDispatch();

  const updateCategories = async () => {
    const fetchedNavCategories: NavCategory[] =
      await GetNavCategoriesOperation();

    if (
      JSON.stringify(fetchedNavCategories) !== JSON.stringify(navCategories)
    ) {
      dispatch(setNavCategories(fetchedNavCategories));
    }

    const fetchedCategories = await GetNavCategoriesOperation();

    if (fetchedCategories.error) {
      toast({
        title: "Error while fetching categories",
        description: fetchedCategories.error,
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    } else {
      if (JSON.stringify(fetchedCategories) !== JSON.stringify(categories)) {
        dispatch(setCategories(fetchedCategories));
      }
    }
  };

  useEffect(() => {
    updateCategories();
  }, []);

  return (
    <Flex
      justifyContent="center"
      zIndex={2}
      position="sticky"
      top={0}
      bg="teal"
      w={"100%"}>
      {screenWidth > 1023 ? (
        <DesktopNav categories={navCategories} />
      ) : (
        <MobileNav categories={navCategories} />
      )}
    </Flex>
  );
};
