import { createSlice } from "@reduxjs/toolkit";
import { HYDRATE } from "next-redux-wrapper";
import { Category } from "../../../types/categories";

interface CategoriesState {
  value: Category[];
}

const initialState: CategoriesState = {
  value: [
    {
      id: 0,
      name: "",
      hierarchicalName: "",
      parentCategoryId: 0,
      depth: 0,
    },
  ],
};

const categoriesSlice = createSlice({
  name: "categories",
  initialState,
  reducers: {
    setCategories(state, action) {
      state.value = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Add reducers for additional action types here, and handle loading state as needed
    builder.addCase(HYDRATE, (state, action: any) => {
      if (action.payload.categories) {
        state.value = action.payload.categories.value;
      }
    });
  },
});

export const { setCategories } = categoriesSlice.actions;
export default categoriesSlice.reducer;
