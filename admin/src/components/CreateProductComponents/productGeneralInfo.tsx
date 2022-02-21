import { Box, FormControl, FormLabel, Switch } from "@chakra-ui/react";
import React from "react";
import {
  CreateProduct,
  resetCreateProductVariations,
  setCreateProductDescription,
  setCreateProductIsOnSale,
  setCreateProductName,
  setCreateProductPrice,
  setCreateProductSale,
} from "../../redux/features/products/createProduct";
import {
  resetEditProductVariations,
  setEditProductDescription,
  setEditProductIsOnSale,
  setEditProductName,
  setEditProductPrice,
  setEditProductSale,
} from "../../redux/features/products/editProduct";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import InputField from "../InputField";

interface ProductGeneralInfoProps {
  values: CreateProduct;
  task: string;
}

const ProductGeneralInfo: React.FC<ProductGeneralInfoProps> = ({
  values,
  task,
}) => {
  const dispatch = useAppDispatch();

  const {
    createProduct: { value: createProductStateLive },
  } = useAppSelector((state) => state);

  return (
    <Box>
      <Box m={2}>
        <InputField
          name="sku"
          disabled
          placeholder="sku"
          label="SKU"
          type="text"
          defaultValue={values.sku}
          validation={{
            required: "Name is required",
          }}
        />
      </Box>

      <Box m={2}>
        <InputField
          name="name"
          placeholder="Product name"
          label="Name"
          type="text"
          onBlur={(e) => {
            if (task === "create") {
              dispatch(setCreateProductName(e.target.value));
            } else if (task === "edit") {
              dispatch(setEditProductName(e.target.value));
            }
          }}
          defaultValue={values.name}
          validation={{
            required: "Name is required",
            minLength: {
              value: 4,
              message: "Name should be at least 4 characters long",
            },
          }}
        />
      </Box>

      <Box m={2}>
        <InputField
          name="description"
          placeholder="Product description"
          label="Description"
          type="text"
          textarea
          onBlur={(e) => {
            if (task === "create") {
              dispatch(setCreateProductDescription(e.target.value));
            } else if (task === "edit") {
              dispatch(setEditProductDescription(e.target.value));
            }
          }}
          defaultValue={values.description}
          validation={{
            required: "Description is required",
          }}
        />
      </Box>

      <Box m={2}>
        <InputField
          name="price"
          placeholder="Product price"
          label="Price"
          type="number"
          onBlur={(e) => {
            if (task === "create") {
              dispatch(setCreateProductPrice(e.target.value));
              dispatch(resetCreateProductVariations());
            } else if (task === "edit") {
              dispatch(setEditProductPrice(e.target.value));
              dispatch(resetEditProductVariations());
            }
          }}
          defaultValue={task === "create" ? values.price : values.minPrice}
          validation={{
            required: "Price is required",
            min: { value: 1, message: "Price must be greater than 0" },
          }}
        />
      </Box>

      <FormControl display="flex" alignItems="center" m={2} my={3}>
        <FormLabel htmlFor="isProductonSale" mb="0">
          Is product on sale?
        </FormLabel>
        <Switch
          isChecked={values.isOnSale}
          id="isProductonSale"
          onChange={(e) => {
            if (task === "create") {
              dispatch(setCreateProductIsOnSale(e.target.checked));
            } else if (task === "edit") {
              dispatch(setEditProductIsOnSale(e.target.checked));
            }
          }}
        />
      </FormControl>

      {values.isOnSale ? (
        <Box m={2}>
          <InputField
            name="discountMultiplier"
            placeholder="Discount (example: 20)"
            label="Discount percentage"
            type="number"
            onBlur={(e) => {
              if (task === "create") {
                dispatch(setCreateProductSale(e.target.value));
                dispatch(resetCreateProductVariations());
              } else if (task === "edit") {
                dispatch(setEditProductSale(e.target.value));
                dispatch(resetEditProductVariations());
              }
            }}
            defaultValue={values.discountMultiplier}
            validation={{
              required: "Discount is required",
              min: { value: 1, message: "Discount must be between 1 and 99" },
              max: { value: 99, message: "Discount must be between 1 and 99" },
            }}
          />
        </Box>
      ) : null}
    </Box>
  );
};

export default ProductGeneralInfo;
