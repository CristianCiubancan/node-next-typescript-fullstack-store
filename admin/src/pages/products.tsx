import { Box, Button, Flex, Text } from "@chakra-ui/react";
import React, { useState } from "react";
import Layout from "../components/Layout";
import ProductComponent from "../components/ProductsPageComponents/ProductComponent";
import ProductsPageTopBar, {
  ProductCategory,
} from "../components/ProductsPageComponents/ProductsPageTopBar";
import GetAllCategoriesOperation from "../operations/category/getAllCategories";
import GetProductsOperation, {
  GetProductsRequestValues,
} from "../operations/product/getProducts";
import { CurrentUser } from "../redux/features/user/userSlice";
import { wrapper } from "../redux/store";
import { Product } from "../types/product";

export interface PaginatedProducts {
  products: Product[];
  hasMore: boolean;
}

export interface PaginatedProductsForm {
  categoryId: string | null;
  searchBy: string;
  searchField: string;
  sort: string;
}

interface ProductsProps {
  products: PaginatedProducts;
  currentUser: CurrentUser;
  errorCode: string;
  categories: ProductCategory[];
}

const initialProductsSearchParams: GetProductsRequestValues = {
  categoryId: null,
  searchBy: "name",
  searchField: "",
  sort: "name:ASC",
  cursor: null,
  firstCursor: null,
  secondCursor: null,
};

const Products: React.FC<ProductsProps> = ({
  currentUser,
  products,
  errorCode,
  categories,
}) => {
  const [productsArray, setProductsArray] =
    useState<PaginatedProducts>(products);
  const [searchParams, setSearchParams] = useState<GetProductsRequestValues>(
    initialProductsSearchParams
  );
  const [fetchMoreLoading, setFetchMoreLoading] = useState<boolean>(false);

  if (categories[0]?.name === "error while fetching") {
    return (
      <Layout currentUser={currentUser}>
        <Text w={"100%"} textAlign={"center"} fontSize={18} fontWeight={"thin"}>
          {`error code ${errorCode} while fetching categories please refresh the page, if the problems persist contact administrator`}
        </Text>
      </Layout>
    );
  }
  return (
    <Layout currentUser={currentUser}>
      <ProductsPageTopBar
        categories={categories}
        setSearchParams={setSearchParams}
        setProductsArray={setProductsArray}
      />
      <Flex mt={"4em"} flexWrap={"wrap"} justifyContent={"space-around"} pb={2}>
        {productsArray.products.map((product: Product) => (
          <Box p={2} key={product.id}>
            <ProductComponent
              product={product}
              productsArray={productsArray}
              setProductsArray={setProductsArray}
            />
          </Box>
        ))}
        {["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""].map(
          (_obj, idx) => (
            <Box key={idx} mx={2} w={[160, 210, 180, 230, 250]}></Box>
          )
        )}
      </Flex>
      {productsArray.hasMore ? (
        <Flex>
          <Button
            mx={4}
            mb={8}
            w={"100%"}
            mt={4}
            isLoading={fetchMoreLoading}
            width={200}
            colorScheme={"teal"}
            onClick={async () => {
              if (!fetchMoreLoading) {
                setFetchMoreLoading(true);
                const lastProduct =
                  productsArray.products[productsArray.products.length - 1];

                let cursor: string = "";
                let firstCursor: string | number | null = null;
                let secondCursor: string | null = null;

                if (
                  searchParams.sort === "name:ASC" ||
                  searchParams.sort === "name:DESC"
                ) {
                  cursor = `('${lastProduct.name}', '${lastProduct.sku}')`;
                  firstCursor = lastProduct.name;
                  secondCursor = lastProduct.sku;
                } else if (
                  searchParams.sort === '"minPrice"*"discountMultiplier":ASC' ||
                  searchParams.sort === '"minPrice"*"discountMultiplier":DESC'
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
                  ...searchParams,
                  cursor,
                  firstCursor,
                  secondCursor,
                });
                setProductsArray({
                  products: [...productsArray.products, ...products.products],
                  hasMore: products.hasMore,
                });

                setFetchMoreLoading(false);
              }
            }}>
            Load more
          </Button>
        </Flex>
      ) : null}
    </Layout>
  );
};

export const getServerSideProps = wrapper.getServerSideProps(() => async () => {
  const products = await GetProductsOperation(initialProductsSearchParams);

  const response = await GetAllCategoriesOperation();

  if (response.error) {
    return {
      props: {
        categories: [{ name: "error while fetching" }],
        errorCode: response.error,
        products,
      },
    };
  }

  return { props: { products, categories: response, errorCode: "" } };
});

export default Products;
