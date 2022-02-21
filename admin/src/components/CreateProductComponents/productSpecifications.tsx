import { Box, Button, Flex } from "@chakra-ui/react";
import { useEffect } from "react";
import { useFormContext } from "react-hook-form";
import {
  addCreateProductSpecification,
  CreateProduct,
  removeCreateProductSpecification,
  setCreateProductSpecificationName,
  setCreateProductSpecificationValue,
} from "../../redux/features/products/createProduct";
import {
  addEditProductSpecification,
  removeEditProductSpecification,
  setEditProductSpecificationName,
  setEditProductSpecificationValue,
} from "../../redux/features/products/editProduct";
import { useAppDispatch } from "../../redux/hooks";
import InputField from "../InputField";

interface ProductSpecificationsProps {
  values: CreateProduct;
  task: string;
}

const ProductSpecifications: React.FC<ProductSpecificationsProps> = ({
  values,
  task,
}) => {
  const dispatch = useAppDispatch();

  const { reset } = useFormContext();

  useEffect(() => {
    reset(values);
  }, [values.specifications]);

  return (
    <Flex flexDirection={"column"}>
      {values.specifications.map((specification, index) => (
        <Flex key={index} alignItems={"flex-end"} w={"100%"}>
          <Box w={"100%"}>
            <InputField
              name={`specifications[${index}].name`}
              placeholder="Specification name"
              label={`Name`}
              type="string"
              onBlur={(e) => {
                if (task === "create") {
                  dispatch(
                    setCreateProductSpecificationName({
                      idx: index,
                      name: e.target.value,
                    })
                  );
                } else if (task === "edit") {
                  dispatch(
                    setEditProductSpecificationName({
                      idx: index,
                      name: e.target.value,
                    })
                  );
                }
              }}
              defaultValue={values.specifications[index].name}
              validation={{
                required: "Specification name is required",
              }}
            />
          </Box>
          <Box ml={2} w={"100%"}>
            <InputField
              name={`specifications[${index}].value`}
              placeholder="Specification value"
              label={`Value`}
              type="string"
              onBlur={(e) => {
                if (task === "create") {
                  dispatch(
                    setCreateProductSpecificationValue({
                      idx: index,
                      value: e.target.value,
                    })
                  );
                } else if (task === "edit") {
                  dispatch(
                    setEditProductSpecificationValue({
                      idx: index,
                      value: e.target.value,
                    })
                  );
                }
              }}
              defaultValue={values.specifications[index].value}
              validation={{
                required: "Specification value is required",
              }}
            />
          </Box>

          <Button
            ml={2}
            colorScheme={"red"}
            onClick={() => {
              if (task === "create") {
                dispatch(removeCreateProductSpecification(index));
              } else if (task === "edit") {
                dispatch(removeEditProductSpecification(index));
              }
            }}>
            X
          </Button>
        </Flex>
      ))}
      <Button
        mt={4}
        colorScheme={"green"}
        onClick={() => {
          if (task === "create") {
            dispatch(addCreateProductSpecification());
          } else if (task === "edit") {
            dispatch(addEditProductSpecification());
          }
        }}>
        Add a specification
      </Button>
    </Flex>
  );
};

export default ProductSpecifications;
