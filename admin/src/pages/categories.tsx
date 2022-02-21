import { Box, Button, Flex, Text } from "@chakra-ui/react";
import React, { useEffect } from "react";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import CreateCategory from "../components/Categories/CreateCategory";
import RemoveCategory from "../components/Categories/RemoveCategory";
import Layout from "../components/Layout";
import CutomRadioGroup from "../components/Radio/CustomRadioGroup";
import GetAllCategoriesOperation from "../operations/category/getAllCategories";
import { CurrentUser } from "../redux/features/user/userSlice";
import { wrapper } from "../redux/store";
import { Category } from "../types/product";

interface CategoryPropduct {
  currentUser: CurrentUser;
  categories: Category[];
  errorCode: string;
}

const Categories: React.FC<CategoryPropduct> = ({
  currentUser,
  categories,
  errorCode,
}) => {
  const [display, setDisplay] = useState<string>("create");

  const [categoriesList, setCategoriesList] = useState<any[]>(categories);

  const methods = useForm();

  const { control, watch } = methods;

  const watchAllFields = watch();

  useEffect(() => {
    setDisplay(watchAllFields.mode);
  }, [watchAllFields]);

  if (categories[0]?.name === "error while fetching") {
    return (
      <Layout currentUser={currentUser}>
        <Text w={"100%"} textAlign={"center"} fontSize={18} fontWeight={"thin"}>
          {`error code ${errorCode} while fetching categories please refresh the page, if the problems persist contact administrator`}
        </Text>
      </Layout>
    );
  }

  return (
    <Layout currentUser={currentUser}>
      <Flex flexDirection={"column"} width={"100%"}>
        <Flex px={4} my={2} w={"100%"}>
          <FormProvider {...methods}>
            <form style={{ width: "100%" }}>
              <CutomRadioGroup
                control={control}
                defaultValue={"create"}
                values={["create", "remove"]}
                name={"mode"}
              />
            </form>
          </FormProvider>
        </Flex>

        {display === "create" ? (
          <CreateCategory
            categories={categoriesList}
            setCategoriesList={setCategoriesList}
          />
        ) : null}
        {display === "remove" ? (
          <RemoveCategory
            categories={categoriesList}
            setCategoriesList={setCategoriesList}
          />
        ) : null}
      </Flex>
    </Layout>
  );
};

export const getServerSideProps = wrapper.getServerSideProps(() => async () => {
  const response = await GetAllCategoriesOperation();

  if (response.error) {
    return {
      props: {
        categories: [{ name: "error while fetching" }],
        errorCode: response.error,
      },
    };
  } else {
    return { props: { categories: response, errorCode: "" } };
  }
});

export default Categories;
