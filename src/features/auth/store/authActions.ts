import { createAsyncThunk } from "@reduxjs/toolkit";
import { authService } from "@features/auth/services/authService";
import { User } from "@appTypes/index";

export const login = createAsyncThunk<
  { user: User; token: string; refreshToken: string },
  { email: string; password: string }
>("auth/login", async ({ email, password }, { rejectWithValue }) => {
  try {
    const response = await authService.login(email, password);
    return response.data.data;
  } catch (error) {
    return rejectWithValue(error);
  }
});

export const register = createAsyncThunk<
  { email: string },
  Partial<User> & { password?: string }
>("auth/register", async (userData, { rejectWithValue }) => {
  try {
    const response = await authService.register(userData);
    const member = response.data.data as { email?: string } | undefined;
    return { email: member?.email || userData.email || '' };
  } catch (error) {
    return rejectWithValue(error);
  }
});

