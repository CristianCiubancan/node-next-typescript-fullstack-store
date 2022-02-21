import { Box, Flex } from "@chakra-ui/react";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import GetAttributesOperation from "../operations/product/getAttributes";
import { useAppSelector } from "../redux/hooks";
import BreadCrumbsComponent from "./BreadCrumbsComponent";
import FilterButton from "./FilterButton";
import SortButton from "./SortButton";

export interface FilterAttribute {
  name: string;
  values: string[];
}

interface StoreUtilityBarProps {}

const StoreUtilityBar: React.FC<StoreUtilityBarProps> = ({}) => {
  const router = useRouter();

  const [attributes, setAttributes] = useState<FilterAttribute[]>([]);

  const { cachedProductCategories } = useAppSelector(
    (state) => state.products.value
  );

  const getAttrbiutes = async (
    categoryId: string | null = null,
    searchField: string | null = null
  ) => {
    const attributes = await GetAttributesOperation(categoryId, searchField);

    setAttributes(attributes);
  };

  useEffect(() => {
    if (router.query?.searchField) {
      if (router.query?.categoryId) {
        getAttrbiutes(
          router.query?.categoryId as string,
          router.query.searchField as string
        );
      } else {
        getAttrbiutes(null, router.query.searchField as string);
      }
    } else {
      if (router.query?.categoryId) {
        getAttrbiutes(router.query?.categoryId as string, null);
      } else {
        getAttrbiutes(null, null);
      }
    }
  }, [router.query]);

  return (
    <Flex
      py={2}
      position={"sticky"}
      zIndex={1}
      top={"4em"}
      flexDirection={"column"}
      px={[4, 4, 4, 5, 6]}
      backgroundColor={"white"}
      w={"100%"}>
      <BreadCrumbsComponent />

      <Flex>
        <Box>
          <SortButton attributes={attributes} />
        </Box>
        <Box ml="auto">
          {attributes.length ? <FilterButton attributes={attributes} /> : null}
        </Box>
      </Flex>
    </Flex>
  );
};

export default StoreUtilityBar;
