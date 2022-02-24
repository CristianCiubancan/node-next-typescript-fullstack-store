import { Box, Flex, Text } from "@chakra-ui/react";
import lodash from "lodash";
import React, { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { Product, Variation } from "../types/product";
import CutomRadioGroup from "./Radio/CustomRadioGroup";

interface ProductInformationProps {
  product: Product;
  selectedVariation: Variation | null | undefined;
  setSelectedVariation: React.Dispatch<
    React.SetStateAction<Variation | null | undefined>
  >;
}

const ProductInformation: React.FC<ProductInformationProps> = ({
  product,
  setSelectedVariation,
  selectedVariation,
}) => {
  const methods = useForm();

  const { control, watch } = methods;

  const watchAllFields = watch();

  const initialPrices = product.variations.map((vari) => vari.price);
  const pricesAfterDiscount = product.variations.map(
    (vari) => vari.price * parseFloat(vari.discountMultiplier)
  );

  useEffect(() => {
    const values = Object.keys(watchAllFields)
      .filter((key) => watchAllFields[key] !== undefined)
      .map((key) => {
        return { name: key, values: [{ name: watchAllFields[key] }] };
      });

    const selectedVariations = lodash.filter(product?.variations, {
      attributes: values,
    }) as any;

    if (selectedVariations.length === 1) {
      setSelectedVariation(selectedVariations[0]);
    }
  }, [watchAllFields]);
  return (
    <Box w={"100%"}>
      <Text fontSize={24} fontWeight={"semibold"} wordBreak={"break-all"}>
        {product.name}
      </Text>
      {!selectedVariation ? (
        <Box>
          {parseFloat(product?.discountMultiplier as string) < 1 ? (
            <Text
              overflow={"hidden"}
              whiteSpace={"nowrap"}
              textOverflow={"ellipsis"}
              as="s"
              fontWeight={"semibold"}
              fontSize={16}>
              {`${Math.min(...initialPrices).toFixed(2)}${
                Math.min(...initialPrices) !== Math.max(...initialPrices)
                  ? ` - ${Math.max(...initialPrices).toFixed(2)}`
                  : ""
              }
            Lei`}
            </Text>
          ) : null}
          <Text
            overflow={"hidden"}
            whiteSpace={"nowrap"}
            fontWeight={"Bold"}
            fontSize={24}
            color={
              parseFloat(product?.discountMultiplier as string) < 1
                ? "red"
                : "black"
            }
            textOverflow={"ellipsis"}>
            {`${Math.min(...pricesAfterDiscount).toFixed(2)}${
              Math.min(...pricesAfterDiscount) !==
              Math.max(...pricesAfterDiscount)
                ? ` - ${Math.max(...pricesAfterDiscount).toFixed(2)}`
                : ""
            }
            Lei`}
          </Text>

          <Text
            overflow={"hidden"}
            whiteSpace={"nowrap"}
            textOverflow={"ellipsis"}
            fontWeight={"normal"}
            color={"teal"}
            mt={2}
            fontSize={16}>
            select product attributes to check availability
          </Text>
        </Box>
      ) : (
        <Box>
          {parseFloat(selectedVariation?.discountMultiplier as string) < 1 ? (
            <Text
              overflow={"hidden"}
              whiteSpace={"nowrap"}
              textOverflow={"ellipsis"}
              as="s"
              fontWeight={"semibold"}
              fontSize={16}>
              {`${selectedVariation?.price.toFixed(2)} Lei`}
            </Text>
          ) : null}
          <Text
            overflow={"hidden"}
            whiteSpace={"nowrap"}
            fontWeight={"Bold"}
            fontSize={24}
            color={
              parseFloat(selectedVariation?.discountMultiplier as string) < 1
                ? "red"
                : "black"
            }
            textOverflow={"ellipsis"}>
            {`${(
              selectedVariation?.price *
              parseFloat(selectedVariation.discountMultiplier)
            ).toFixed(2)} Lei`}
          </Text>

          {selectedVariation.stock === 0 ? (
            <Text
              mt={2}
              overflow={"hidden"}
              whiteSpace={"nowrap"}
              textOverflow={"ellipsis"}
              fontWeight={"semibold"}
              fontSize={18}
              color={"red"}>
              {`out of stock`}
            </Text>
          ) : (
            <Box>
              <Flex alignItems={"flex-end"} mt={2}>
                <Text
                  overflow={"hidden"}
                  whiteSpace={"nowrap"}
                  textOverflow={"ellipsis"}
                  fontWeight={"semibold"}
                  fontSize={16}>
                  {`in stock: `}
                </Text>
                <Text
                  ml={1}
                  overflow={"hidden"}
                  whiteSpace={"nowrap"}
                  textOverflow={"ellipsis"}
                  fontWeight={"extrabold"}
                  fontSize={16}>
                  {selectedVariation.stock}
                </Text>
              </Flex>
            </Box>
          )}
        </Box>
      )}

      <FormProvider {...methods}>
        <form>
          <Flex flexDirection={"column"} py={4}>
            {product.attributes?.map((attribute) => {
              return (
                <Box key={attribute.id} mb={2}>
                  <Text
                    my={2}
                    color={"gray"}
                    fontWeight={"semibold"}
                    fontSize={"lg"}>
                    {attribute.name}
                  </Text>
                  <CutomRadioGroup
                    control={control}
                    values={attribute.values}
                    name={attribute.name}
                    task={"attributes"}
                  />
                </Box>
              );
            })}
          </Flex>
        </form>
      </FormProvider>
    </Box>
  );
};

export default ProductInformation;
