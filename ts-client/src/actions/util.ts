import store from "../redux/store"
import axios from 'axios'

// Generic dispatchAction function
export const dispatchAction = (type: string, payload: any = null): void => {
    store.dispatch({ type, payload });
};

// Define the function with a typed parameter
export const setAuthToken = (token: string | null): void => {
  if (token) {
    // Apply authorization token to every request if logged in
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    // Delete auth header if there's no token
    delete axios.defaults.headers.common['Authorization'];
  }
};

