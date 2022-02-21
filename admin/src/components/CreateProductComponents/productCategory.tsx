import { Box, FormLabel, Select } from "@chakra-ui/react";
import React, { useState } from "react";
import { useFormContext } from "react-hook-form";
import {
  CreateProduct,
  setCreateProductCategory,
} from "../../redux/features/products/createProduct";
import { setEditProductCategory } from "../../redux/features/products/editProduct";
import { useAppDispatch } from "../../redux/hooks";
import { Category } from "../../types/product";

interface GeneralInfoProps {
  categories: Category[];
  values: CreateProduct;
  task: string;
}

const ProductCategory: React.FC<GeneralInfoProps> = ({
  categories,
  values,
  task,
}) => {
  const [categoriesList, _setCategoriesList] = useState<any[]>(categories);

  const dispatch = useAppDispatch();

  const { clearErrors, register } = useFormContext();

  const getCategory = (value: string) => {
    return value === "0"
      ? [{ id: 0, name: "uncategorized" }]
      : categories.filter((category) => category.id === parseInt(value));
  };

  return (
    <Box m={2}>
      <FormLabel htmlFor={"categories[0].id"}>Category</FormLabel>
      <Select
        {...register("categories[0].id")}
        defaultValue={
          values.categories.length === 0 ? "0" : values.categories[0].id
        }
        onChange={(e) => {
          clearErrors();
          if (task === "create") {
            dispatch(setCreateProductCategory(getCategory(e.target.value)));
          } else if (task === "edit") {
            dispatch(setEditProductCategory(getCategory(e.target.value)));
          }
        }}>
        <option value="0">No category</option>
        {categoriesList.map((category) => {
          return (
            <option key={category.id} value={`${category.id}`}>
              {category.hierarchicalName}
            </option>
          );
        })}
      </Select>
    </Box>
  );
};

export default ProductCategory;
