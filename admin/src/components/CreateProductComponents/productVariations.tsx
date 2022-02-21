import { Box, Button, Flex } from "@chakra-ui/react";
import React, { useEffect } from "react";
import { useFormContext } from "react-hook-form";
import {
  CreateProduct,
  generateCreateProductVariations,
  setCreateProductVariationName,
  setCreateProductVariationPrice,
  setCreateProductVariationSale,
  setCreateProductVariationStock,
} from "../../redux/features/products/createProduct";
import {
  generateEditProductVariations,
  setEditProductVariationName,
  setEditProductVariationPrice,
  setEditProductVariationSale,
  setEditProductVariationStock,
} from "../../redux/features/products/editProduct";
import { useAppDispatch } from "../../redux/hooks";
import InputField from "../InputField";

interface ProductVariationsProps {
  values: CreateProduct;
  task: string;
}

const ProductVariations: React.FC<ProductVariationsProps> = ({
  values,
  task,
}) => {
  const dispatch = useAppDispatch();

  const { setError, clearErrors, reset } = useFormContext();

  useEffect(() => {
    reset(values);
  }, [values.variations]);

  return (
    <Box>
      {values.attributes.length > 0 ? (
        <Box>
          <Flex flexDirection={"column"}>
            <Button
              m={2}
              type="button"
              colorScheme={"purple"}
              onClick={() => {
                let emptyAttributeFields: number[] = [];
                let emptyValueFields: any[] = [];
                values.attributes.forEach((attribute, attrIdx) => {
                  if (attribute.name === "") {
                    emptyAttributeFields.push(attrIdx);
                  }
                  attribute.values.forEach((value, valIdx) => {
                    if (value.name === "") {
                      emptyValueFields.push({ attrIdx, valIdx });
                    }
                  });
                });

                if (values.price === "") {
                  setError("price", { message: "price cannot be empty" });
                } else if (emptyAttributeFields.length) {
                  emptyAttributeFields.forEach((field) => {
                    setError(`attributes[${field}].name`, {
                      message: "attribute name cannot be empty",
                    });
                  });
                } else if (emptyValueFields.length) {
                  emptyValueFields.forEach((field) => {
                    setError(
                      `attributes[${field.attrIdx}].values[${field.valIdx}].name`,
                      {
                        message: "value name cannot be empty",
                      }
                    );
                  });
                } else if (
                  values.isOnSale &&
                  values.discountMultiplier === ""
                ) {
                  setError(`discountMultiplier`, {
                    message:
                      "discount must be greater than 1 as long as product is on sale",
                  });
                } else {
                  clearErrors();
                  if (task === "create") {
                    dispatch(generateCreateProductVariations());
                  } else if (task === "edit") {
                    dispatch(generateEditProductVariations());
                  }
                }
              }}>
              Generate variations
            </Button>
          </Flex>
          <Flex flexDirection="column">
            {values.variations.length > 0 &&
              values.variations.map((_variation, index) => (
                <Flex m={2} key={index} alignItems={"flex-end"}>
                  <InputField
                    name={`variations[${index}].name`}
                    placeholder="Variation name"
                    label={`Name`}
                    type="text"
                    onBlur={(e) => {
                      if (task === "create") {
                        dispatch(
                          setCreateProductVariationName({
                            index,
                            name: e.target.value,
                          })
                        );
                      } else if (task === "edit") {
                        dispatch(
                          setEditProductVariationName({
                            index,
                            name: e.target.value,
                          })
                        );
                      }
                    }}
                    defaultValue={values.variations[index].name}
                    validation={{
                      required: "Variation name is required",
                    }}
                  />
                  <Box ml={2}>
                    <InputField
                      name={`variations[${index}].price`}
                      placeholder="Variation price"
                      label={`Price`}
                      type="number"
                      onBlur={(e) => {
                        if (task === "create") {
                          dispatch(
                            setCreateProductVariationPrice({
                              index,
                              price: e.target.value,
                            })
                          );
                        } else if (task === "edit") {
                          dispatch(
                            setEditProductVariationPrice({
                              index,
                              price: e.target.value,
                            })
                          );
                        }
                      }}
                      defaultValue={values.variations[index].price}
                      validation={{
                        required: "Variation price is required",
                        min: { value: 1, message: "price cannot be 0" },
                      }}
                    />
                  </Box>

                  <Box ml={2}>
                    <InputField
                      name={`variations[${index}].stock`}
                      placeholder="Variation stock"
                      label={`Stock`}
                      type="number"
                      onBlur={(e) => {
                        if (task === "create") {
                          dispatch(
                            setCreateProductVariationStock({
                              index,
                              stock: e.target.value,
                            })
                          );
                        } else if (task === "edit") {
                          dispatch(
                            setEditProductVariationStock({
                              index,
                              stock: e.target.value,
                            })
                          );
                        }
                      }}
                      defaultValue={values.variations[index].stock}
                      validation={{
                        required: "Variation stock is required",
                      }}
                    />
                  </Box>

                  {values.isOnSale ? (
                    <Box ml={2}>
                      <InputField
                        name={`variations[${index}].discountMultiplier`}
                        placeholder="Variation discount"
                        label={`Discount %`}
                        type="number"
                        onBlur={(e) => {
                          if (task === "create") {
                            dispatch(
                              setCreateProductVariationSale({
                                index,
                                discountMultiplier: e.target.value,
                              })
                            );
                          } else if (task === "edit") {
                            dispatch(
                              setEditProductVariationSale({
                                index,
                                discountMultiplier: e.target.value,
                              })
                            );
                          }
                        }}
                        defaultValue={
                          values.variations[index].discountMultiplier
                        }
                        validation={{
                          min: {
                            value: 0,
                            message: "Discount must be between 1 and 99",
                          },
                          max: {
                            value: 99,
                            message: "Discount must be between 1 and 99",
                          },
                        }}
                      />
                    </Box>
                  ) : null}
                </Flex>
              ))}
          </Flex>
        </Box>
      ) : null}
    </Box>
  );
};

export default ProductVariations;
