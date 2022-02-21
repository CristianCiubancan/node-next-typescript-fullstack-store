import {
  Box,
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Select,
  useToast,
} from "@chakra-ui/react";
import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import RemoveCategoryOperation from "../../operations/category/removeCategory";
import LogoutOperation from "../../operations/user/logout";
import { Category } from "../../types/product";
import InputField from "../InputField";

export interface HierarchicalCategory extends Category {
  hierarchicalName: string;
}

interface RemoveCategoryProps {
  categories: HierarchicalCategory[];
  setCategoriesList: React.Dispatch<React.SetStateAction<any[]>>;
}

export interface CreateCategoryFormFields {
  parentCategoryId?: string;
  name: string;
  error: string;
}

const RemoveCategory: React.FC<RemoveCategoryProps> = ({
  categories,
  setCategoriesList,
}) => {
  const methods = useForm<CreateCategoryFormFields>();

  const {
    handleSubmit,
    reset,
    register,
    trigger,
    getValues,
    setError,
    formState: { errors },
  } = methods;

  const toast = useToast();

  const onSubmit = async (data: CreateCategoryFormFields) => {
    const categoryToRemoveId = parseInt(data.parentCategoryId as string);

    const response = await RemoveCategoryOperation({
      categoryId: categoryToRemoveId,
    });

    if (response.error) {
      if (response.error === "Your session expired, please relog") {
        await LogoutOperation();
        window.location.href = "/login";
      } else {
        setError("error", {
          type: "custom",
          message: response.error,
        });
      }
    } else {
      setCategoriesList(
        categories.filter((category) => category.id !== categoryToRemoveId)
      );
      reset();

      toast({
        title: "Category removed.",
        description: `Category successfully removed.`,
        status: "success",
        duration: 4000,
        isClosable: true,
      });
    }
  };
  return (
    <FormProvider {...methods}>
      <form name="remove-product" onSubmit={handleSubmit(onSubmit)}>
        <Flex flexDirection={"column"} mx={10} textAlign={"center"}>
          <Box m={2}>
            <FormLabel htmlFor={"parentCategoryId"}>Name</FormLabel>
            <Select {...register("parentCategoryId")} defaultValue={"option1"}>
              {categories.map((category) => (
                <option key={category.id} value={`${category.id}`}>
                  {category.hierarchicalName}
                </option>
              ))}
            </Select>
          </Box>

          <Box m={2} display={"none"}>
            <InputField
              name={`error`}
              placeholder="Category error"
              label={`Error`}
              type="text"
            />
          </Box>

          <Box my={2}>
            <FormControl p={2} isInvalid={!!errors}>
              {errors && (
                <FormErrorMessage mb={2}>
                  {errors.error?.message}
                </FormErrorMessage>
              )}
              <Button
                width={"100%"}
                name="submit-button"
                colorScheme={"red"}
                onClick={async () => {
                  const valid = await trigger();
                  if (valid) {
                    onSubmit(getValues());
                  }
                }}
                type="button">
                Remove category
              </Button>
            </FormControl>
          </Box>
        </Flex>
      </form>
    </FormProvider>
  );
};

export default RemoveCategory;
