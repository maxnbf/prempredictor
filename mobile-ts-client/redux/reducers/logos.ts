import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { getLogos } from '../../actions/util';

interface LogosState {
  logos: Record<string, string>;  
  loading: boolean;
  error: string | null;
}

const initialState: LogosState = {
  logos: {}, 
  loading: false,
  error: null,
};

// Async thunk to fetch logo URLs
export const fetchLogos = createAsyncThunk(
  'logos/fetchLogos',
    async () => {
      console.log("Fetching logos...");
    return await getLogos()
  }
);

const logosSlice = createSlice({
  name: 'logos',
  initialState,
  reducers: {
    resetLogosState: (state) => {
      state.logos = {};
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLogos.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchLogos.fulfilled, (state, action) => {
        state.logos = action.payload;
        state.loading = false;
        state.error = null;
      })
      // can add an error case here if needed
  },
});

export default logosSlice.reducer;
