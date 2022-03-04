import { Flex } from "@chakra-ui/layout";
import { useToast } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import GetNavCategoriesOperation from "../../operations/category/getNavCategories";
import { setNavCategories } from "../../redux/features/navCategories/navCategoriesSlice";
import { useAppSelector } from "../../redux/hooks";
import { NavCategory } from "../../types/navCategories";
import { getScreenSize } from "../../utils/getScreenSize";
import { DesktopNav } from "./Desktop";
import { MobileNav } from "./Mobile";

interface NavBarProps {}

export const NavBar: React.FC<NavBarProps> = () => {
  const { width: screenWidth } = getScreenSize();

  const toast = useToast();

  const [navigationCategories, setNavigationCategories] = useState<
    NavCategory[]
  >([]);

  const {
    navCategories: { value: navCategories },
  } = useAppSelector((state) => state);

  const dispatch = useDispatch();

  const updateCategories = async () => {
    if (navCategories.length) {
      setNavigationCategories(navCategories);
    }

    const fetchedNavCategories = await GetNavCategoriesOperation();

    if (fetchedNavCategories.error) {
      toast({
        title: "Error while fetching categories",
        description: fetchedNavCategories.error,
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    } else if (
      JSON.stringify(fetchedNavCategories) !== JSON.stringify(navCategories)
    ) {
      setNavigationCategories(fetchedNavCategories);
      dispatch(setNavCategories(fetchedNavCategories));
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
      bg="purple.600"
      w={"100%"}>
      {screenWidth > 1023 ? (
        <DesktopNav categories={navigationCategories} />
      ) : (
        <MobileNav categories={navigationCategories} />
      )}
    </Flex>
  );
};
