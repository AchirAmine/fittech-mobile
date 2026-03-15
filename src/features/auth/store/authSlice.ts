import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { queryClient } from "@shared/services/queryClient";
import {
  handlePending,
  handleFulfilled,
  handleRejected,
  initialRequestState,
} from "@store/helpers";
import { User } from "@appTypes/index";
import { AuthState } from "./authTypes";
import { login, register } from "./authActions";

const initialState: AuthState = {
  user: null,
  token: null,
  refreshToken: null,
  isAuthenticated: false,
  ...initialRequestState,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{
        user: User;
        token: string;
        refreshToken: string;
      }>,
    ) => {
      const { user, token, refreshToken } = action.payload;
      state.user = user;
      state.token = token;
      state.refreshToken = refreshToken;
      state.isAuthenticated = !!token;
    },
    logout: (state) => {
      queryClient.clear();
      
      state.user = null;
      state.token = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      state.status = "idle";
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        handlePending(state);
      })
      .addCase(
        login.fulfilled,
        (
          state,
          action: PayloadAction<{
            user: User;
            token: string;
            refreshToken: string;
          }>,
        ) => {
          handleFulfilled(state);
          const { user, token, refreshToken } = action.payload;
          state.isAuthenticated = true;
          state.user = user;
          state.token = token;
          state.refreshToken = refreshToken;
        },
      )
      .addCase(login.rejected, (state, action) => {
        handleRejected(state, action);
      })
      .addCase(register.pending, (state) => {
        handlePending(state);
      })
      .addCase(
        register.fulfilled,
        (
          state,
          _action: PayloadAction<{ email: string }>,
        ) => {
          handleFulfilled(state);
        },
      )
      .addCase(register.rejected, (state, action) => {
        handleRejected(state, action);
      })
  },
});

export const { setCredentials, logout, clearError } = authSlice.actions;
export default authSlice.reducer;
