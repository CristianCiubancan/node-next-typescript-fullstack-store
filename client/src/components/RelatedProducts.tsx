import { Box, Flex, Heading, useToast } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import GetRelatedProductsOperation from "../operations/product/getRelatedProducts";
import { Product } from "../types/product";
import ProductComponent from "./ProductComponent";
import CarouselThumbs from "./CarouselThumbs";

interface RelatedProductsProps {
  product: Product;
}
const RelatedProducts: React.FC<RelatedProductsProps> = ({ product }) => {
  const [relatedProducts, setRelatedProducts] = useState<Product[]>();

  const toast = useToast();

  const getRelatedProducts = async () => {
    if (product.id) {
      const relProds = await GetRelatedProductsOperation({
        categoryId:
          product.categories.length && product.categories[0].id
            ? product.categories[0].id
            : null,
        productId: product.id,
      });

      if (relProds.error) {
        toast({
          title: "Error",
          description: relProds.error,
          status: "error",
          duration: 9000,
          isClosable: true,
        });
      } else {
        setRelatedProducts(relProds);
      }
    }
  };

  useEffect(() => {
    getRelatedProducts();
  }, []);
  return relatedProducts?.length ? (
    <Flex flexDirection={"column"} w={"100%"} mt={10}>
      <Heading textAlign={"center"}>Related Products</Heading>
      <Box my={4}>
        <CarouselThumbs containerName={"relatedProducts"}>
          {relatedProducts?.map((product) => (
            <Box key={product.sku} p={2}>
              <ProductComponent product={product} />
            </Box>
          ))}
        </CarouselThumbs>
      </Box>
    </Flex>
  ) : null;
};

export default RelatedProducts;
