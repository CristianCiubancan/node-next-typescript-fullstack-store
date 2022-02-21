import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import { createWrapper } from "next-redux-wrapper";
import createProductReducer from "./features/products/createProduct";
import createEditProductReducer from "./features/products/editProduct";
import userReducer from "./features/user/userSlice";

import {
  nextReduxCookieMiddleware,
  wrapMakeStore,
} from "next-redux-cookie-wrapper";

export const makeStore = wrapMakeStore(() =>
  configureStore({
    reducer: {
      createProduct: createProductReducer,
      editProduct: createEditProductReducer,
      user: userReducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().prepend(
        nextReduxCookieMiddleware({
          // maxAge: 30,
          maxAge: 60 * 60 * 24 * 10,
          subtrees: [`createProduct`, `user`],
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
