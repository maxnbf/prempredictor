import axios from 'axios';
import { setAuthToken } from './util';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';
import { resetStore, signInResponse } from '../redux/reducers/auth';
import store from '../redux/store';


interface LoginUserData {
  username: string;
  password: string;
}

interface RegisterUserData extends LoginUserData {
  name: string;
}

interface AuthResponse {
  token: string;
  username: string;
}

// Modify your loginUser function to return a Promise<boolean>
export const loginUser = async (
  userData: LoginUserData
): Promise<boolean> => {
  try {
    const res = await axios.post<AuthResponse>('http://10.0.0.169:9000/auth/signin', userData);
    const { token, username } = res.data;

    // Store token and username in AsyncStorage
    await AsyncStorage.setItem('jwtToken', token);
    await AsyncStorage.setItem('username', username);

    // Set the token globally or with your context/state
    setAuthToken(token);

    store.dispatch(signInResponse({ username, token }));

    // Return true on success
    return true;
  } catch (err) {
    console.error('FAILED SIGN IN', err);
    Alert.alert('Login Failed', 'Invalid username or password');

    // Return false if login fails
    return false;
  }
};


// Register User
export const registerUser = async (userData: RegisterUserData) => {
  try {
    await  axios
    .post('http://10.0.0.169:9000/auth/signup', userData)
  } catch (e) {
    console.log('ERROR', e);
  }
};
