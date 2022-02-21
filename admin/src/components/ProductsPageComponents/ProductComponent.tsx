import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  Divider,
  Flex,
  Image,
  Text,
  useToast,
} from "@chakra-ui/react";
import NextLink from "next/link";
import React, { useState } from "react";
import DeleteProductOperation from "../../operations/product/deleteProduct";
import { PaginatedProducts } from "../../pages/products";
import { Product } from "../../types/product";
import AlertDialogButton from "../AlertDialog";

interface ProductComponentProps {
  product: Product;
  productsArray: PaginatedProducts;
  setProductsArray: React.Dispatch<React.SetStateAction<PaginatedProducts>>;
}

const ProductComponent: React.FC<ProductComponentProps> = ({
  product,
  productsArray,
  setProductsArray,
}) => {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const toast = useToast();

  return (
    <Accordion
      borderColor={"white"}
      allowToggle
      position={"relative"}
      w={[160, 210, 180, 230, 250]}>
      {product.isOnSale ? (
        <Flex
          bg={"red"}
          justifyContent={"center"}
          alignItems={"center"}
          top={-2}
          right={-2}
          position={"absolute"}
          borderRadius={"full"}
          textColor={"white"}
          boxSize={"2.5em"}
          fontWeight={"bold"}
          fontSize={12}>
          Sale
        </Flex>
      ) : null}

      <AccordionItem>
        <Image
          borderTopRadius={6}
          w={[160, 210, 180, 230, 250]}
          h={[160, 210, 180, 230, 250]}
          objectFit={"cover"}
          src={
            product.images[0]?.sizes.filter((size) => size.width === 300)[0]
              ?.url
          }
          fallbackSrc={product.images[0]?.placeholderUrl}
        />

        <Flex
          w={[160, 210, 180, 230, 250]}
          justifyContent={"space-between"}
          backgroundColor={"teal.500"}
          alignItems={"center"}
          borderBottomRadius={6}>
          <Text
            width={"100%"}
            textAlign={"center"}
            color={"white"}
            px={4}
            whiteSpace={"nowrap"}
            overflow={"hidden"}
            textOverflow={"ellipsis"}>
            {product.name}
          </Text>
          <Divider orientation="vertical" h={5} />
          <h2>
            <AccordionButton
              borderBottomRightRadius={6}
              backgroundColor={"teal.500"}
              _hover={{ bg: "teal.600" }}
              color={"white"}>
              <AccordionIcon />
            </AccordionButton>
          </h2>
        </Flex>
        <AccordionPanel p={2}>
          <Flex flexDirection={"column"}>
            <Text fontWeight={"bold"}>name:</Text>
            <Text fontWeight={"light"}>{product.name}</Text>
            <Text fontWeight={"bold"}>description:</Text>
            <Text fontWeight={"light"}>{product.description}</Text>
            <Text fontWeight={"bold"}>category:</Text>
            <Text fontWeight={"light"}>
              {product.categories[0]
                ? product.categories[0].name
                : "Uncategorized"}
            </Text>
            <Text fontWeight={"bold"}>price:</Text>
            <Text fontWeight={"light"}>
              {product.minPrice === product.maxPrice
                ? parseFloat(product.minPrice).toFixed(2)
                : `  ${product.minPrice} - ${product.maxPrice}`}
            </Text>
            {product.isOnSale ? (
              <Box>
                <Text fontWeight={"bold"}>discounted price:</Text>
                <Text fontWeight={"light"}>
                  {(
                    parseFloat(product.minPrice) *
                    parseFloat(product.discountMultiplier)
                  ).toFixed(2)}
                </Text>
              </Box>
            ) : null}
            <Flex w={"100%"} mt={"2"} mb={4}>
              <AlertDialogButton
                title="Delete product"
                isSubmitting={isSubmitting}
                functionToExecute={async () => {
                  setIsSubmitting(true);

                  const response = await DeleteProductOperation({
                    id: product.id as number,
                  });

                  if (response.error) {
                    toast({
                      title: "Error",
                      description: response.error,
                      status: "error",
                      duration: 9000,
                      isClosable: true,
                    });
                  } else {
                    setProductsArray({
                      ...productsArray,
                      products: productsArray.products.filter(
                        (otherProduct) => otherProduct.id !== product.id
                      ),
                    });
                  }
                }}
                message="Are you sure you want to delete this product, be cautios as this action is irreversible!"
              />
              <NextLink href={`/edit-product/${product.sku}`}>
                <Button ml={2} colorScheme={"green"}>
                  Edit
                </Button>
              </NextLink>
            </Flex>
          </Flex>
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  );
};

export default ProductComponent;
