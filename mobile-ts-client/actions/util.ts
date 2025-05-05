import axios from 'axios';
import Constants from 'expo-constants';

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

export const API_URL = process.env.EXPO_PUBLIC_API_URL!

export const getLogos = async (): Promise<Record<string, string>> => {
  try {
    const response = await axios.get(`${API_URL}/api/util/getLogos`)
    return response.data as Record<string, string>;
  } catch (e) {
    console.log('ERROR', (e as Error).stack);
    return {
      
    }
  }

};

