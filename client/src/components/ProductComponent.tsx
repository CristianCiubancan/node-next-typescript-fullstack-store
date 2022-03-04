import { Box, Image, ScaleFade, Text } from "@chakra-ui/react";
import React, { useRef } from "react";
import { useInViewport } from "react-in-viewport";
import { Product } from "../types/product";
import NextLink from "next/link";

interface ProductComponentProps {
  product: Product;
}
const ProductComponent: React.FC<ProductComponentProps> = ({ product }) => {
  const ref = useRef(null) as any;

  const initialPrices = product.variations.map((vari) => vari.price);
  const pricesAfterDiscount = product.variations.map(
    (vari) => vari.price * parseFloat(vari.discountMultiplier)
  );

  const { enterCount } = useInViewport(
    ref,
    { rootMargin: "-10px" },
    { disconnectOnLeave: false },
    {}
  );
  return (
    <NextLink href={`/product?productId=${product.sku}`}>
      <ScaleFade
        initialScale={0.95}
        in={enterCount}
        whileHover={{ scale: 1.02 }}>
        <Box
          cursor={"pointer"}
          ref={ref}
          w={[160, 210, 180, 230, 250]}
          position={"relative"}
          mb={4}>
          {product.isOnSale ? (
            <Box
              backgroundColor={"red"}
              position={"absolute"}
              py={2}
              px={1}
              borderRadius={"full"}
              color={"white"}
              fontWeight={"bold"}
              fontSize={14}
              top={-2}
              right={-2}>
              {`-${((1 - parseFloat(product.discountMultiplier)) * 100).toFixed(
                0
              )}%`}
            </Box>
          ) : null}
          <Image
            alt={product.name}
            borderRadius={6}
            w={[160, 210, 180, 230, 250]}
            h={[160, 210, 180, 230, 250]}
            objectFit={"cover"}
            src={
              product.images[0]?.sizes.filter((size) => size.width === 500)[0]
                ?.url
            }
            fallbackSrc={product.images[0]?.placeholderUrl}
          />
          <Text
            mt={1}
            overflow={"hidden"}
            whiteSpace={"nowrap"}
            textOverflow={"ellipsis"}>
            {product.name}
          </Text>

          {product.isOnSale ? (
            <Text
              overflow={"hidden"}
              whiteSpace={"nowrap"}
              fontWeight={"semibold"}
              fontSize={16}
              textOverflow={"ellipsis"}>
              {Math.min(...initialPrices) === Math.max(...initialPrices)
                ? `${Math.min(...initialPrices).toFixed(2)} Lei`
                : `${Math.min(...initialPrices).toFixed(2)} Lei - ${Math.max(
                    ...initialPrices
                  ).toFixed(2)} Lei`}
            </Text>
          ) : null}

          <Text
            overflow={"hidden"}
            whiteSpace={"nowrap"}
            fontWeight={"semibold"}
            fontSize={18}
            color={product.isOnSale ? "red" : "black"}
            textOverflow={"ellipsis"}>
            {Math.min(...pricesAfterDiscount) ===
            Math.max(...pricesAfterDiscount)
              ? `${Math.min(...pricesAfterDiscount).toFixed(2)} Lei`
              : `${Math.min(...pricesAfterDiscount).toFixed(2)} - ${Math.max(
                  ...pricesAfterDiscount
                ).toFixed(2)} Lei`}
          </Text>
        </Box>
      </ScaleFade>
    </NextLink>
  );
};

export default ProductComponent;
