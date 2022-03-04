import {
  Box,
  Flex,
  Skeleton,
  SkeletonText,
  Spinner,
  Text,
  useToast,
} from "@chakra-ui/react";
import Head from "next/head";
import { useRouter } from "next/router";
import { NextPage } from "next/types";
import { useCallback, useEffect, useRef, useState } from "react";
import Layout from "../components/Layout";
import ProductComponent from "../components/ProductComponent";
import StoreUtilityBar, {
  FilterAttribute,
} from "../components/StoreUtilityBar";
import GetCategoryNameOperation from "../operations/category/getCategoryName";
import GetProductsOperation, {
  GetProductsRequestValues,
} from "../operations/product/getProducts";
import {
  addProducts,
  setIsLoading,
  setProductsArray,
} from "../redux/features/products/productsSlice";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { wrapper } from "../redux/store";
import { Product } from "../types/product";
import { getParams } from "../utils/getParams";
import { newSearchParams } from "../utils/newSearchParams";

interface StoreProps {
  pageProps: {
    initialProps: {
      categoryNameData: string;
    };
  };
}

export interface SearchParams {
  searchBy: string;
  categoryId: string | null;
  sort: string;
  searchField: string;
  attributes: FilterAttribute[] | null;
}

const Store: NextPage<StoreProps> = ({ pageProps }) => {
  const [endReached, setEndReached] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(false);
  const [isFetchingMore, setIsFetchingMore] = useState<boolean>(false);
  const [localIsLoading, setLocalIsLoading] = useState<boolean>(true);

  const { isLoading, cachedProductCategories } = useAppSelector(
    (state) => state.products.value
  );

  const dispatch = useAppDispatch();

  const router = useRouter();

  const observer = useRef(null) as any;

  const lastProductRef = useCallback(
    (product) => {
      if (isLoading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          setEndReached(true);
        }
      });
      if (product) observer.current.observe(product);
    },
    [isLoading, hasMore]
  );

  const toast = useToast();

  const setProductsFunction = async (data: GetProductsRequestValues) => {
    dispatch(setIsLoading(true));
    setLocalIsLoading(true);
    const products = await GetProductsOperation(data);

    if (products.error) {
      toast({
        title: "Error",
        description: products.error,
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    } else {
      dispatch(
        setProductsArray({
          productsArray: products.products,
          routerQuery: router.asPath,
          hasMore: products.hasMore,
        })
      );
    }
    dispatch(setIsLoading(false));
    setLocalIsLoading(false);
  };

  const fetchMore = async () => {
    setIsFetchingMore(true);
    const data = newSearchParams(getParams(router.query) as any);

    const currentCategory = cachedProductCategories?.filter(
      (cc) => cc.routerQuery === router.asPath
    );

    if (currentCategory.length) {
      const lastProduct =
        currentCategory[0].productsArray[
          currentCategory[0].productsArray.length - 1
        ];

      let cursor: string = "";
      let firstCursor: string | number | null = null;
      let secondCursor: string | null = null;

      if (data.sort === "name:ASC" || data.sort === "name:DESC") {
        cursor = `('${lastProduct.name}', '${lastProduct.sku}')`;
        firstCursor = lastProduct.name;
        secondCursor = lastProduct.sku;
      } else if (
        data.sort === '"minPrice"*"discountMultiplier":ASC' ||
        data.sort === '"minPrice"*"discountMultiplier":DESC'
      ) {
        cursor = `('${
          parseFloat(lastProduct.minPrice) *
          parseFloat(lastProduct.discountMultiplier)
        }', '${lastProduct.sku}')`;

        firstCursor =
          parseFloat(lastProduct.minPrice) *
          parseFloat(lastProduct.discountMultiplier);
        secondCursor = lastProduct.sku;
      }
      const products = await GetProductsOperation({
        ...data,
        cursor,
        firstCursor,
        secondCursor,
      } as GetProductsRequestValues);

      if (products.error) {
        toast({
          title: "Error",
          description: products.error,
          status: "error",
          duration: 9000,
          isClosable: true,
        });
      } else {
        dispatch(
          addProducts({
            productsArray: products.products,
            routerQuery: router.asPath,
            hasMore: products.hasMore,
          })
        );
        setHasMore(products.hasMore);
      }
    }

    setEndReached(false);
    setIsLoading(false);
    setIsFetchingMore(false);
  };

  useEffect(() => {
    if (endReached && hasMore) {
      fetchMore();
    }
  }, [endReached, hasMore]);

  useEffect(() => {
    setLocalIsLoading(true);
    const data = router.query;

    const params = getParams(data);

    const cachedCategory = cachedProductCategories?.filter(
      (cc) => cc.routerQuery === router.asPath
    );

    if (!cachedCategory.length) {
      setProductsFunction(newSearchParams(params as any));
    }
  }, [router.query]);

  const currentCategory = cachedProductCategories?.filter(
    (cc) => cc.routerQuery === router.asPath
  )[0];

  useEffect(() => {
    if (currentCategory?.hasMore) setHasMore(currentCategory.hasMore);
  }, [currentCategory]);

  return (
    <Layout>
      <StoreUtilityBar />
      <Head>
        <title>{pageProps.initialProps.categoryNameData}</title>
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <meta
          property="og:title"
          content={pageProps.initialProps.categoryNameData}
        />
        <meta property="og:site_name" content="store.happyoctopus.net" />
        <meta
          property="og:description"
          content={`Latest and greatest products in ${pageProps.initialProps.categoryNameData} brought to you exclusively by HappyOctopus's Jelly Bracelets.`}
        />
        <meta
          name="description"
          content={`Latest and greatest products in ${pageProps.initialProps.categoryNameData} brought to you exclusively by HappyOctopus's Jelly Bracelets.`}
        />
        <meta property="og:image" content="/favicon-96x96.png" />
      </Head>
      <Flex flexWrap={"wrap"} justifyContent={"space-around"} pb={2}>
        {cachedProductCategories
          ?.filter((cc) => cc.routerQuery === router.asPath)[0]
          ?.productsArray.map((product: Product, idx: number) => {
            return (
              <Box
                p={2}
                key={product.id}
                ref={
                  cachedProductCategories?.filter(
                    (cc) => cc.routerQuery === router.asPath
                  )[0]?.productsArray.length ===
                  idx + 1
                    ? lastProductRef
                    : undefined
                }>
                <ProductComponent product={product} />
              </Box>
            );
          })}
        {Array.from({ length: 16 }).map((_obj, idx) => (
          <Box key={idx} mx={2} w={[160, 210, 180, 230, 250]}></Box>
        ))}
      </Flex>

      {isLoading ? (
        <Flex flexWrap={"wrap"} justifyContent={"space-around"} pb={2}>
          {Array.from({ length: 16 }).map((x, idx) => {
            return (
              <Box mb={6} p={2} key={idx}>
                <Box
                  py={2}
                  w={[160, 210, 180, 230, 250]}
                  h={[160, 210, 180, 230, 250]}>
                  <Skeleton borderRadius={6} w={"100%"} h={"100%"}></Skeleton>
                </Box>
                <SkeletonText mt="4" noOfLines={3} spacing="4" />
              </Box>
            );
          })}
          {Array.from({ length: 16 }).map((_obj, idx) => (
            <Box key={idx} mx={2} w={[160, 210, 180, 230, 250]}></Box>
          ))}
        </Flex>
      ) : null}

      {!isLoading &&
      localIsLoading &&
      !cachedProductCategories?.filter(
        (cc) => cc.routerQuery === router.asPath
      )[0]?.productsArray.length ? (
        <Text w={"100%"} textAlign={"center"} fontSize={18} fontWeight={"thin"}>
          {`No products matching this criteria, sorry :)`}
        </Text>
      ) : null}

      {isFetchingMore ? (
        <Flex justifyContent={"center"} alignItems={"center"}>
          <Spinner my={4} color={"purple.500"} />
        </Flex>
      ) : null}
    </Layout>
  );
};

Store.getInitialProps = wrapper.getInitialPageProps(
  (store) => async (context) => {
    const categoryName = await GetCategoryNameOperation(
      parseInt(context.query.categoryId as string)
    );

    if (!categoryName[0]) {
      return {
        categoryNameData: "All products",
      };
    } else {
      return {
        categoryNameData: categoryName[0]?.hierarchicalName,
      };
    }
  }
);

export default Store;
