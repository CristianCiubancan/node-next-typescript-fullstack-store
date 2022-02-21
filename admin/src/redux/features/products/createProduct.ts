import { createSlice, current } from "@reduxjs/toolkit";
import { HYDRATE } from "next-redux-wrapper";
import { Product } from "../../../types/product";
import { cartesianProduct } from "../../../utils/generateProductVariations";

export interface CreateProduct extends Product {
  price: string;
}

interface CreateProductState {
  value: CreateProduct;
}

export const initialCreateProductState: CreateProductState = {
  value: {
    name: "",
    sku: "",
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

const createProductSlice = createSlice({
  name: "createProduct",
  initialState: initialCreateProductState,
  reducers: {
    resetCreateProductState(state) {
      state.value = initialCreateProductState.value;
    },
    setCreateProductName(state, action) {
      state.value.name = action.payload;
    },
    setCreateProductSku(state, action) {
      state.value.sku = action.payload;
    },
    setCreateProductSale(state, action) {
      state.value.discountMultiplier = action.payload;
    },
    setCreateProductStock(state, action) {
      state.value.stock = action.payload;
    },
    setCreateProductIsOnSale(state, action) {
      state.value.isOnSale = action.payload;
    },
    setCreateProductDescription(state, action) {
      state.value.description = action.payload;
    },
    setCreateProductPrice(state, action) {
      state.value.price = action.payload;
    },
    setCreateProductCategory(state, action) {
      state.value.categories = action.payload;
    },
    resetCreateProductVariations(state) {
      state.value.variations = [];
    },
    setCreateProductImages(state, action) {
      state.value.images = action.payload;
    },
    addCreateProductAttribute(state) {
      state.value.attributes = [
        ...current(state.value.attributes),
        { name: "", values: [{ name: "" }] },
      ];
    },
    addCreateProductAttributeValue(state, action) {
      state.value.attributes[action.payload.attributeIdx].values = [
        ...current(state.value.attributes[action.payload.attributeIdx].values),
        { name: "" },
      ];
    },
    removeCreateProductAttribute(state, action) {
      state.value.attributes = current(state.value.attributes).filter(
        (_attribute, idx) => idx !== action.payload
      );
    },
    removeCreateProductAttributeValue(state, action) {
      state.value.attributes[action.payload.attributeIdx].values = current(
        state.value.attributes
      )[action.payload.attributeIdx].values.filter(
        (_value, idx) => idx !== action.payload.valueIdx
      );
    },
    setCreateProductAttributeName(state, action) {
      state.value.attributes[action.payload.idx].name = action.payload.name;
    },
    setCreateProductAttributeValue(state, action) {
      state.value.attributes[action.payload.attributeIdx].values[
        action.payload.valueIdx
      ].name = action.payload.value;
    },
    generateCreateProductVariations(state) {
      const { attributes, price, discountMultiplier } = current(state.value);

      let productVariations = cartesianProduct(
        attributes.map((obj) => obj.values.map((value) => value.name)),
        attributes.map((obj) => obj.name),
        parseFloat(price.toString()),
        discountMultiplier
      );

      state.value.variations = productVariations;
    },
    setCreateProductVariationName(state, action) {
      state.value.variations[action.payload.index].name = action.payload.name;
    },
    setCreateProductVariationPrice(state, action) {
      state.value.variations[action.payload.index].price = action.payload.price;
    },
    setCreateProductVariationStock(state, action) {
      state.value.variations[action.payload.index].stock = action.payload.stock;
    },
    setCreateProductVariationSale(state, action) {
      state.value.variations[action.payload.index].discountMultiplier =
        action.payload.discountMultiplier;
    },
    setCreateProductSpecificationName(state, action) {
      state.value.specifications[action.payload.idx].name = action.payload.name;
    },
    setCreateProductSpecificationValue(state, action) {
      state.value.specifications[action.payload.idx].value =
        action.payload.value;
    },
    removeCreateProductSpecification(state, action) {
      state.value.specifications = current(state.value.specifications).filter(
        (_attribute, idx) => idx !== action.payload
      );
    },
    addCreateProductSpecification(state) {
      state.value.specifications = [
        ...current(state.value.specifications),
        { name: "", value: "" },
      ];
    },
  },
  extraReducers: (builder) => {
    // Add reducers for additional action types here, and handle loading state as needed
    builder.addCase(HYDRATE, (state, action: any) => {
      if (action.payload.createProduct) {
        state.value = action.payload.createProduct.value;
      }
    });
  },
});

export const {
  setCreateProductSku,
  resetCreateProductState,
  setCreateProductName,
  setCreateProductSale,
  setCreateProductIsOnSale,
  setCreateProductDescription,
  setCreateProductPrice,
  setCreateProductStock,
  setCreateProductCategory,
  resetCreateProductVariations,
  setCreateProductImages,
  addCreateProductAttribute,
  addCreateProductAttributeValue,
  removeCreateProductAttribute,
  removeCreateProductAttributeValue,
  setCreateProductAttributeName,
  setCreateProductAttributeValue,
  generateCreateProductVariations,
  setCreateProductVariationName,
  setCreateProductVariationPrice,
  setCreateProductVariationStock,
  setCreateProductVariationSale,
  addCreateProductSpecification,
  removeCreateProductSpecification,
  setCreateProductSpecificationValue,
  setCreateProductSpecificationName,
} = createProductSlice.actions;
export default createProductSlice.reducer;
