import { createSlice } from "@reduxjs/toolkit";
import { HYDRATE } from "next-redux-wrapper";

export interface CurrentUser {
  id: number | null;
  username: string;
  isAdmin: boolean;
}

interface UsersState {
  value: CurrentUser;
}

const initialState: UsersState = {
  value: { id: null, username: "none", isAdmin: false },
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser(state, action) {
      state.value = action.payload;
    },
    setUserAsGuest(state) {
      state.value = {
        id: 0,
        isAdmin: false,
        username: "guest",
      };
    },
    resetUser(state) {
      state.value = initialState.value;
    },
  },
  extraReducers: (builder) => {
    // Add reducers for additional action types here, and handle loading state as needed
    builder.addCase(HYDRATE, (state, action: any) => {
      if (action.payload.user) {
        state.value = action.payload.user.value;
      }
    });
  },
});

export const { resetUser, setUser, setUserAsGuest } = userSlice.actions;
export default userSlice.reducer;
