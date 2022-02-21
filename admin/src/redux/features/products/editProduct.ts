import { createSlice, current } from "@reduxjs/toolkit";
import { HYDRATE } from "next-redux-wrapper";
import { Product } from "../../../types/product";
import { cartesianProduct } from "../../../utils/generateProductVariations";

export interface EditProduct extends Product {
  price: string;
}

interface EditProductState {
  value: EditProduct;
}

export const initialEditProductState: EditProductState = {
  value: {
    sku: "",
    name: "",
    minPrice: "",
    maxPrice: "",
    description: "",
    price: "",
    stock: "",
    discountMultiplier: "",
    isOnSale: false,
    categories: [{ id: 0, name: "uncategorized" }],
    attributes: [{ name: "", values: [{ name: "" }] }],
    variations: [],
    specifications: [{ name: "", value: "" }],
    images: [],
  },
};

const EditProductSlice = createSlice({
  name: "EditProduct",
  initialState: initialEditProductState,
  reducers: {
    setEditProductState(state, action) {
      state.value = action.payload;
    },
    resetEditProductState(state) {
      state.value = initialEditProductState.value;
    },
    setEditProductName(state, action) {
      state.value.name = action.payload;
    },
    setEditProductSale(state, action) {
      state.value.discountMultiplier = action.payload;
    },
    setEditProductStock(state, action) {
      state.value.stock = action.payload;
    },
    setEditProductIsOnSale(state, action) {
      state.value.isOnSale = action.payload;
    },
    setEditProductDescription(state, action) {
      state.value.description = action.payload;
    },
    setEditProductPrice(state, action) {
      state.value.price = action.payload;
    },
    setEditProductCategory(state, action) {
      state.value.categories = action.payload;
    },
    resetEditProductVariations(state) {
      state.value.variations = [];
    },
    setEditProductImages(state, action) {
      state.value.images = action.payload;
    },
    addEditProductAttribute(state) {
      state.value.attributes = [
        ...current(state.value.attributes),
        { name: "", values: [{ name: "" }] },
      ];
    },
    addEditProductAttributeValue(state, action) {
      state.value.attributes[action.payload.attributeIdx].values = [
        ...current(state.value.attributes[action.payload.attributeIdx].values),
        { name: "" },
      ];
    },
    removeEditProductAttribute(state, action) {
      state.value.attributes = current(state.value.attributes).filter(
        (_attribute, idx) => idx !== action.payload
      );
    },
    removeEditProductAttributeValue(state, action) {
      state.value.attributes[action.payload.attributeIdx].values = current(
        state.value.attributes
      )[action.payload.attributeIdx].values.filter(
        (_value, idx) => idx !== action.payload.valueIdx
      );
    },
    setEditProductAttributeName(state, action) {
      state.value.attributes[action.payload.idx].name = action.payload.name;
    },
    setEditProductAttributeValue(state, action) {
      state.value.attributes[action.payload.attributeIdx].values[
        action.payload.valueIdx
      ].name = action.payload.value;
    },
    generateEditProductVariations(state) {
      const { attributes, price, discountMultiplier } = current(state.value);

      let productVariations = cartesianProduct(
        attributes.map((obj) => obj.values.map((value) => value.name)),
        attributes.map((obj) => obj.name),
        parseFloat(price.toString()),
        discountMultiplier
      );

      state.value.variations = productVariations;
    },
    setEditProductVariationName(state, action) {
      state.value.variations[action.payload.index].name = action.payload.name;
    },
    setEditProductVariationPrice(state, action) {
      state.value.variations[action.payload.index].price = action.payload.price;
    },
    setEditProductVariationStock(state, action) {
      state.value.variations[action.payload.index].stock = action.payload.stock;
    },
    setEditProductVariationSale(state, action) {
      state.value.variations[action.payload.index].discountMultiplier =
        action.payload.discountMultiplier;
    },
    setEditProductSpecificationName(state, action) {
      state.value.specifications[action.payload.idx].name = action.payload.name;
    },
    setEditProductSpecificationValue(state, action) {
      state.value.specifications[action.payload.idx].value =
        action.payload.value;
    },
    addEditProductSpecification(state) {
      state.value.specifications = [
        ...current(state.value.specifications),
        { name: "", value: "" },
      ];
    },
    removeEditProductSpecification(state, action) {
      state.value.specifications = current(state.value.specifications).filter(
        (_attribute, idx) => idx !== action.payload
      );
    },
  },
  extraReducers: (builder) => {
    // Add reducers for additional action types here, and handle loading state as needed
    builder.addCase(HYDRATE, (state, action: any) => {
      if (action.payload.editProduct) {
        state.value = action.payload.editProduct.value;
      }
    });
  },
});

export const {
  setEditProductState,
  resetEditProductState,
  setEditProductName,
  setEditProductSale,
  setEditProductIsOnSale,
  setEditProductDescription,
  setEditProductPrice,
  setEditProductStock,
  setEditProductCategory,
  resetEditProductVariations,
  setEditProductImages,
  addEditProductAttribute,
  addEditProductAttributeValue,
  removeEditProductAttribute,
  removeEditProductAttributeValue,
  setEditProductAttributeName,
  setEditProductAttributeValue,
  generateEditProductVariations,
  setEditProductVariationName,
  setEditProductVariationPrice,
  setEditProductVariationStock,
  setEditProductVariationSale,
  setEditProductSpecificationValue,
  setEditProductSpecificationName,
  removeEditProductSpecification,
  addEditProductSpecification,
} = EditProductSlice.actions;
export default EditProductSlice.reducer;
