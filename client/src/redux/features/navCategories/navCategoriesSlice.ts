import { createSlice } from "@reduxjs/toolkit";
import { HYDRATE } from "next-redux-wrapper";
import { NavCategory } from "../../../types/navCategories";

interface navCategoriesState {
  value: NavCategory[];
}

const initialState: navCategoriesState = {
  value: [
    {
      id: 0,
      name: "",
      hierarchicalName: "",
      parentCategoryId: null,
      subCategory: [],
    },
  ],
};

const navCategoriesSlice = createSlice({
  name: "navCategories",
  initialState,
  reducers: {
    setNavCategories(state, action) {
      state.value = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Add reducers for additional action types here, and handle loading state as needed
    builder.addCase(HYDRATE, (state, action: any) => {
      if (action.payload.navCategories) {
        state.value = action.payload.navCategories.value;
      }
    });
  },
});

export const { setNavCategories } = navCategoriesSlice.actions;
export default navCategoriesSlice.reducer;
