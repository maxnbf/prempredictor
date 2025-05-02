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
  console.log("hello", API_URL)
  try {
    const response = await axios.get(`http://3.145.171.117:8080/api/util/getLogos`)
    console.log(response)
    return response.data as Record<string, string>;
  } catch (e) {
    console.log('ERROR', (e as Error).stack);
    return {
      
    }
  }

};

