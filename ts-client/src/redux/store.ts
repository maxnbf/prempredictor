import { configureStore } from '@reduxjs/toolkit';
import authReducer from './reducers/auth';

// Create the store with the root reducer
const store = configureStore({
  reducer: {
    auth: authReducer, // Add your reducers here
  },
  // You can also add middleware and other configurations if needed
});

export default store;
