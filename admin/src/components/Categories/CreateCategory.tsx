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
import CreateCategoryOperation from "../../operations/category/createCategory";
import LogoutOperation from "../../operations/user/logout";
import InputField from "../InputField";

interface CreateCategoryProps {
  categories: any[];
  setCategoriesList: React.Dispatch<React.SetStateAction<any[]>>;
}

export interface CreateCategoryFormFields {
  parentCategoryId?: string;
  name: string;
  error: string;
}

const CreateCategory: React.FC<CreateCategoryProps> = ({
  categories,
  setCategoriesList,
}) => {
  const methods = useForm<CreateCategoryFormFields>();

  const {
    trigger,
    reset,
    clearErrors,
    register,
    getValues,
    setError,
    formState: { errors },
  } = methods;

  const toast = useToast();

  const onSubmit = async (data: CreateCategoryFormFields) => {
    const parentCategoryObject = categories.filter(
      (category) => category.id === parseInt(data.parentCategoryId as string)
    )[0];

    const requestData = parentCategoryObject
      ? {
          ...data,
          hierarchicalName: `${parentCategoryObject.hierarchicalName} - ${data.name}`,
          parentCategory: parentCategoryObject,
        }
      : { ...data, hierarchicalName: data.name };

    const response = await CreateCategoryOperation(requestData);

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
      setCategoriesList([...categories, response]);
      reset({ name: "", parentCategoryId: "null" });
      toast({
        title: "Category created.",
        description: `Category ${requestData.name} successfuly created.`,
        status: "success",
        duration: 4000,
        isClosable: true,
      });
    }
  };
  return (
    <FormProvider {...methods}>
      <form name="create-product">
        <Flex flexDirection={"column"} mx={10} textAlign={"center"}>
          <Box m={2}>
            <FormLabel htmlFor={"parentCategoryId"}>Category parent</FormLabel>
            <Select {...register("parentCategoryId")} defaultValue={"option1"}>
              <option value="null">No parent</option>
              {categories.map((category) => (
                <option key={category.id} value={`${category.id}`}>
                  {category.hierarchicalName}
                </option>
              ))}
            </Select>
          </Box>

          <Box m={2}>
            <InputField
              name={`name`}
              placeholder="Category name"
              label={`Name`}
              type="text"
              onChange={(e) => {
                clearErrors();
              }}
              validation={{
                required: "Category name is required",
              }}
            />
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
                colorScheme={"green"}
                onClick={async () => {
                  const valid = await trigger();
                  if (valid) {
                    onSubmit(getValues());
                  }
                }}
                type="button">
                Create category
              </Button>
            </FormControl>
          </Box>
        </Flex>
      </form>
    </FormProvider>
  );
};

export default CreateCategory;
