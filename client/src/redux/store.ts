import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import { createWrapper } from "next-redux-wrapper";
import userReducer from "./features/user/userSlice";
import categoriesReducer from "./features/categories/categoriesSlice";
import navCategoriesReducer from "./features/navCategories/navCategoriesSlice";
import productsReducer from "./features/products/productsSlice";
import cartReducer from "./features/cart/cartSlice";

import {
  nextReduxCookieMiddleware,
  wrapMakeStore,
} from "next-redux-cookie-wrapper";

export const makeStore = wrapMakeStore(() =>
  configureStore({
    reducer: {
      user: userReducer,
      categories: categoriesReducer,
      navCategories: navCategoriesReducer,
      products: productsReducer,
      cart: cartReducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().prepend(
        nextReduxCookieMiddleware({
          // maxAge: 30,
          maxAge: 60 * 60 * 24 * 10,
          subtrees: [`user`, `navCategories`, "categories", "cart"],
        })
      ),
  })
);

export type AppStore = ReturnType<typeof makeStore>;

export type AppState = ReturnType<AppStore["getState"]>;

export type AppDispatch = AppStore["dispatch"];

export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  AppState,
  unknown,
  Action<string>
>;

export const wrapper = createWrapper<AppStore>(makeStore);
