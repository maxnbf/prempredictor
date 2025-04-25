import { createSlice, PayloadAction } from '@reduxjs/toolkit';


interface AuthState {
  user_info: any;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  user_info: {},
  isAuthenticated: false,
};


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

export const { signInResponse, signUpResponse, resetStore } = authSlice.actions;

export default authSlice.reducer;
