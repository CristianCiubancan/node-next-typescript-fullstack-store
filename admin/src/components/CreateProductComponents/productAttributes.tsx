import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  Flex,
} from "@chakra-ui/react";
import React, { useEffect } from "react";
import { useState } from "react";
import { useFormContext } from "react-hook-form";
import {
  addCreateProductAttribute,
  addCreateProductAttributeValue,
  CreateProduct,
  removeCreateProductAttribute,
  removeCreateProductAttributeValue,
  resetCreateProductVariations,
  setCreateProductAttributeName,
  setCreateProductAttributeValue,
} from "../../redux/features/products/createProduct";
import { useAppDispatch } from "../../redux/hooks";
import InputField from "../InputField";
import { Attribute, Value } from "../../types/product";
import {
  addEditProductAttribute,
  addEditProductAttributeValue,
  removeEditProductAttribute,
  removeEditProductAttributeValue,
  resetEditProductVariations,
  setEditProductAttributeName,
  setEditProductAttributeValue,
} from "../../redux/features/products/editProduct";

interface ProductAttributesProps {
  values: CreateProduct;
  task: string;
}

const ProductAttributes: React.FC<ProductAttributesProps> = ({
  values,
  task,
}) => {
  const dispatch = useAppDispatch();

  const [renders, setRenders] = useState<number>(1);

  const { reset } = useFormContext();

  useEffect(() => {
    if (values.variations.length > 0 && renders > 1) {
    }
    setRenders(renders + 1);

    reset(values);
  }, [values.attributes]);

  return (
    <Flex flexDirection={"column"}>
      <Accordion allowMultiple>
        {values.attributes.length > 0 &&
          values.attributes.map((_attribute: Attribute, index: number) => (
            <AccordionItem m={2} key={index}>
              <AccordionButton>
                <Box flex="1" textAlign="left">
                  {`Attribute no. ${index + 1}`}
                </Box>
                <AccordionIcon />
              </AccordionButton>

              <AccordionPanel pb={4}>
                <InputField
                  name={`attributes[${index}].name`}
                  placeholder="Attribute name"
                  label={`Attribute no. ${index + 1} name`}
                  type="text"
                  onBlur={(e) => {
                    if (task === "create") {
                      dispatch(
                        setCreateProductAttributeName({
                          idx: index,
                          name: e.target.value,
                        })
                      );
                      dispatch(resetCreateProductVariations());
                    } else if (task === "edit") {
                      dispatch(
                        setEditProductAttributeName({
                          idx: index,
                          name: e.target.value,
                        })
                      );
                      dispatch(resetEditProductVariations());
                    }
                  }}
                  defaultValue={values.attributes[index].name}
                  validation={{
                    required: "Attribute name is required",
                  }}
                />

                <Button
                  type="button"
                  w={"100%"}
                  colorScheme={"red"}
                  onClick={() => {
                    if (values.attributes.length > 1) {
                      if (task === "create") {
                        dispatch(removeCreateProductAttribute(index));
                        dispatch(resetCreateProductVariations());
                      } else if (task === "edit") {
                        dispatch(removeEditProductAttribute(index));
                        dispatch(resetEditProductVariations());
                      }
                      reset(values);
                    }
                  }}>
                  X
                </Button>
                <Flex flexWrap={"wrap"} alignItems={"flex-end"}>
                  {values.attributes[index].values.length > 0 &&
                    values.attributes[index].values.map(
                      (_value: Value, valIndex: number) => (
                        <Box m={2} key={valIndex}>
                          <InputField
                            name={`attributes[${index}].values[${valIndex}].name`}
                            placeholder="Value"
                            label={`Value no. ${valIndex + 1}`}
                            type="text"
                            onBlur={(e) => {
                              if (task === "create") {
                                dispatch(
                                  setCreateProductAttributeValue({
                                    attributeIdx: index,
                                    valueIdx: valIndex,
                                    value: e.target.value,
                                  })
                                );
                                dispatch(resetCreateProductVariations());
                              } else if (task === "edit") {
                                dispatch(
                                  setEditProductAttributeValue({
                                    attributeIdx: index,
                                    valueIdx: valIndex,
                                    value: e.target.value,
                                  })
                                );
                                dispatch(resetEditProductVariations());
                              }
                            }}
                            defaultValue={
                              values.attributes[index].values[valIndex].name
                            }
                            validation={{
                              required: "Attribute value is required",
                            }}
                          />

                          <Button
                            type="button"
                            w={"100%"}
                            colorScheme={"red"}
                            onClick={() => {
                              if (values.attributes[index].values.length > 1) {
                                if (task === "create") {
                                  dispatch(
                                    removeCreateProductAttributeValue({
                                      attributeIdx: index,
                                      valueIdx: valIndex,
                                    })
                                  );
                                  dispatch(resetCreateProductVariations());
                                } else if (task === "edit") {
                                  dispatch(
                                    removeEditProductAttributeValue({
                                      attributeIdx: index,
                                      valueIdx: valIndex,
                                    })
                                  );
                                  dispatch(resetEditProductVariations());
                                }

                                reset(values);
                              }
                            }}>
                            X
                          </Button>
                        </Box>
                      )
                    )}
                  <Button
                    m={2}
                    type="button"
                    colorScheme={"blue"}
                    onClick={() => {
                      if (task === "create") {
                        dispatch(
                          addCreateProductAttributeValue({
                            attributeIdx: index,
                          })
                        );
                        dispatch(resetCreateProductVariations());
                      } else if (task === "edit") {
                        dispatch(
                          addEditProductAttributeValue({
                            attributeIdx: index,
                          })
                        );
                        dispatch(resetEditProductVariations());
                      }

                      reset(values);
                    }}>
                    Add value
                  </Button>
                </Flex>
              </AccordionPanel>
            </AccordionItem>
          ))}
        <Button
          w={"100%"}
          my={2}
          type="button"
          colorScheme={"blue"}
          onClick={() => {
            if (task === "create") {
              dispatch(addCreateProductAttribute());
              dispatch(resetCreateProductVariations());
            } else if (task === "edit") {
              dispatch(addEditProductAttribute());
              dispatch(resetEditProductVariations());
            }

            reset(values);
          }}>
          Add attribute
        </Button>
      </Accordion>
    </Flex>
  );
};

export default ProductAttributes;
