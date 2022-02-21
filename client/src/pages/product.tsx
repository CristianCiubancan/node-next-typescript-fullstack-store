import { Box, Button, Flex, Text } from "@chakra-ui/react";
import Head from "next/head";
import { useRouter } from "next/router";
import { NextPage, NextPageContext } from "next/types";
import { useEffect, useState } from "react";
import AddToCartButton from "../components/AddToCartButton";
import Carousel from "../components/Carousel";
import Layout from "../components/Layout";
import ProductDescriptionAndSpecifications from "../components/ProductDescriptionAndSpecifications";
import ProductInformation from "../components/ProductInformation";
import RelatedProducts from "../components/RelatedProducts";
import GetProductOperation from "../operations/product/getProduct";
import { Product, Variation } from "../types/product";
import { getScreenSize } from "../utils/getScreenSize";

interface ProductProps {
  pageProps: {
    productData: Product;
  };
}

const Product: NextPage<ProductProps> = ({ pageProps }) => {
  const screenSize = getScreenSize();
  const [selectedVariation, setSelectedVariation] =
    useState<Variation | null>();

  const [product, setProduct] = useState<Product | null>(null);
  const [isProductLoading, setIsProductLoading] = useState<boolean>(false);
  const router = useRouter();

  const fetchProduct = async (id: string) => {
    setIsProductLoading(true);

    const product = await GetProductOperation({ id });

    if (product.error) {
      setProduct(null);
    } else {
      setProduct(product);
    }

    setIsProductLoading(false);
  };

  useEffect(() => {
    const data = router.query;

    setSelectedVariation(null);

    if (data.productId) {
      fetchProduct(data.productId as string);
    }
  }, [router.query]);
  return (
    <Layout>
      <Head>
        <title>{product ? product.name : pageProps.productData.name}</title>
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <meta
          property="og:title"
          content={product ? product.name : pageProps.productData.name}
        />
        <meta property="og:site_name" content="store.happyoctopus.net" />
        <meta
          property="og:description"
          content={
            product ? product.description : pageProps.productData.description
          }
        />
        <meta
          property="og:image"
          content={
            product
              ? product.images[0]?.sizes.filter(
                  (size: any) => size.width === 150
                )[0]?.url
              : pageProps.productData.images[0]?.sizes.filter(
                  (size: any) => size.width === 150
                )[0]?.url
          }
        />
      </Head>
      {!product && !isProductLoading ? (
        <Flex flexDirection={"column"} alignItems={"center"}>
          <Text mt={4} fontSize={20} fontWeight={"light"}>
            There was an issue retrieving this product's infos
          </Text>
          <Button
            onClick={() => {
              router.push("/");
            }}
            colorScheme={"teal"}
            mt={4}>
            Go home
          </Button>
        </Flex>
      ) : null}
      {product && !isProductLoading ? (
        <Flex flexDirection={"column"} w={"100%"} p={4} alignItems={"center"}>
          <Flex
            w={screenSize.width >= 1024 ? "100%" : 500}
            maxW="100%"
            flexDirection={screenSize.width >= 1024 ? "row" : "column"}>
            <Flex flexDirection={"column"} maxW="100%" w={500}>
              <Carousel images={product?.images} />
              <Box pt={10} pb={2}>
                <ProductDescriptionAndSpecifications product={product} />
              </Box>
            </Flex>
            <Flex flexDirection={"column"} w={"100%"}>
              <Box
                position={"sticky"}
                top={"4em"}
                pl={screenSize.width >= 1024 ? 10 : 0}
                pt={screenSize.width >= 1024 ? 0 : 4}>
                <ProductInformation
                  product={product}
                  selectedVariation={selectedVariation}
                  setSelectedVariation={setSelectedVariation}
                />
                {selectedVariation ? (
                  <Box w={"100%"}>
                    <AddToCartButton
                      product={product}
                      variation={selectedVariation}
                    />
                  </Box>
                ) : null}
              </Box>
            </Flex>
          </Flex>
          <Box w={"100%"}>
            <RelatedProducts product={product} />
          </Box>
        </Flex>
      ) : null}
    </Layout>
  );
};

(Product as any).getInitialProps = async (context: NextPageContext) => {
  const product = await GetProductOperation({
    id: context.query.productId as string,
  });

  if (product.error) {
    return {
      productData: null,
    };
  } else {
    return {
      productData: product,
    };
  }
};

export default Product;
