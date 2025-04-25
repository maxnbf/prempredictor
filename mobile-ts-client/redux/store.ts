import { configureStore } from '@reduxjs/toolkit';
import authReducer from './reducers/auth';
import logosReducer from "./reducers/logos";

const store = configureStore({
  reducer: {
    auth: authReducer,
    logos: logosReducer, 
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
