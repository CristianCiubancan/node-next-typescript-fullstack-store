import { createSlice, current } from "@reduxjs/toolkit";
import { HYDRATE } from "next-redux-wrapper";
import { Product } from "../../../types/product";

interface CachedCategory {
  routerQuery: string;
  productsArray: Product[];
  hasMore: boolean;
}

interface ProductsCache {
  cachedProductCategories: CachedCategory[];
  isLoading: boolean;
}

interface ProductsState {
  value: ProductsCache;
}

const initialState: ProductsState = {
  value: {
    cachedProductCategories: [],
    isLoading: false,
  },
};

const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    // setRouterQuery(state, action) {
    //   const otherCats = (state.value.cachedProductCategories = current(
    //     state
    //   ).value.cachedProductCategories.filter(
    //     (cachedCat) => cachedCat.routerQuery !== action.payload
    //   ));

    //   const currentCat = (state.value.cachedProductCategories = current(
    //     state
    //   ).value.cachedProductCategories.filter(
    //     (cachedCat) => cachedCat.routerQuery === action.payload
    //   ));

    //   state.value.cachedProductCategories = [
    //     ...otherCats,
    //     { routerQuery: action.payload, productsArray: [] },
    //   ];
    // },
    setProductsArray(state, action) {
      const otherCats = current(state).value.cachedProductCategories.filter(
        (cachedCat) => cachedCat.routerQuery !== action.payload.routerQuery
      );

      const currentCat = current(state).value.cachedProductCategories.filter(
        (cachedCat) => cachedCat.routerQuery === action.payload.routerQuery
      );

      state.value.cachedProductCategories = [
        ...otherCats,
        {
          routerQuery: action.payload.routerQuery,
          productsArray: action.payload.productsArray,
          hasMore: action.payload.hasMore,
        },
      ];
    },
    addProducts(state, action) {
      const otherCats = current(state).value.cachedProductCategories.filter(
        (cachedCat) => cachedCat.routerQuery !== action.payload.routerQuery
      );

      const currentCat = current(state).value.cachedProductCategories.filter(
        (cachedCat) => cachedCat.routerQuery === action.payload.routerQuery
      );

      state.value.cachedProductCategories = [
        ...otherCats,
        {
          ...currentCat[0],
          productsArray: [
            ...currentCat[0].productsArray,
            ...action.payload.productsArray,
          ],
        },
      ];
    },
    // setHasMore(state, action) {
    //   state.value.hasMore = action.payload;
    // },
    setIsLoading(state, action) {
      state.value.isLoading = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Add reducers for additional action types here, and handle loading state as needed
    builder.addCase(HYDRATE, (state, action: any) => {
      if (action.payload.products) {
        state.value = action.payload.products.value;
      }
    });
  },
});

export const {
  // setRouterQuery,
  setProductsArray,
  addProducts,
  // setHasMore,
  setIsLoading,
} = productsSlice.actions;
export default productsSlice.reducer;
