import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import * as authApi from "store/api/auth";
import { errorMessages } from "helpers/errorMessages";

export const initialAuthState = {
  user: null,
  token: null,
  status: "idle",
  error: null,
};

export const authenticate = createAsyncThunk(
  "auth/authenticate",
  async ({ credentials, isLogin }, { rejectWithValue }) => {
    try {
      const response = isLogin
        ? await authApi.login(credentials)
        : await authApi.signUp(credentials);
      return {
        user: response.data?.data?.attributes ?? null,
        token: response.headers?.authorization ?? null,
      };
    } catch (error) {
      return rejectWithValue(errorMessages(error));
    }
  }
);

// The local session is cleared even when the API call fails: a user whose
// token is already revoked or expired must still be able to sign out.
export const logout = createAsyncThunk("auth/logout", async () => {
  await authApi.logout().catch(() => null);
});

const authSlice = createSlice({
  name: "auth",
  initialState: initialAuthState,
  reducers: {
    sessionExpired: () => initialAuthState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(authenticate.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(authenticate.fulfilled, (state, { payload }) => {
        state.status = "idle";
        // Sign-up may not hand out a token; the user then logs in normally.
        if (payload.token && payload.user) {
          state.user = payload.user;
          state.token = payload.token;
        }
      })
      .addCase(authenticate.rejected, (state, { payload }) => {
        state.status = "idle";
        state.error = payload ?? null;
      })
      .addCase(logout.fulfilled, () => initialAuthState);
  },
});

export const { sessionExpired } = authSlice.actions;

export const selectIsSignedIn = (state) =>
  Boolean(state.auth.user && state.auth.token);

export default authSlice.reducer;
