// src/reducers/auth.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Define the state shape for `auth` slice
interface AuthState {
  user_info: any;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  user_info: {},
  isAuthenticated: false,
};

// Create the slice for auth
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    signInResponse: (state, action: PayloadAction<{ username: string; token: string }>) => {
      state.user_info = action.payload;
      state.isAuthenticated = true;
    },
    signUpResponse: (state, action: PayloadAction<{ username: string; email: string }>) => {
      state.user_info = action.payload;
      state.isAuthenticated = true;
    },
    resetStore: (state) => {
      state.user_info = {};
      state.isAuthenticated = false;
    },
  },
});

// Export the actions
export const { signInResponse, signUpResponse, resetStore } = authSlice.actions;

// Export the reducer
export default authSlice.reducer;
