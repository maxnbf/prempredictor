import axios from 'axios';
import { Dispatch } from 'redux';
import { SIGN_IN_RESPONSE } from '../redux/types/auth';
import { dispatchAction, setAuthToken } from './util';

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

// Login User
export const loginUser = (userData: LoginUserData) => {
  axios
    .post<AuthResponse>('http://10.0.0.1698080auth/signin', userData)
    .then((res) => {
      const { token, username } = res.data;
      localStorage.setItem('jwtToken', token);
      localStorage.setItem('username', username);

      setAuthToken(token);

      // Dispatching the SIGN_IN_RESPONSE action
      dispatchAction(SIGN_IN_RESPONSE, { username });

      // Redirect to home
      window.location.href = '/home';
    })
    .catch((err) => {
      console.error('FAILED SIGN IN', err);
    });
};

// Register User
export const registerUser = (userData: RegisterUserData) => {
  axios
    .post('http://10.0.0.1698080auth/signup', userData)
    .then(() => {
      // Redirect to login page after successful registration
      window.location.href = '/login';
    })
    .catch((err) => {
      console.error('ERROR', err);
    });
};

// Logout User
export const logoutUser = () => {
  localStorage.removeItem('jwtToken');
  localStorage.removeItem('username');

  // Remove auth header for future requests
  setAuthToken(null);

  // Dispatching empty user object to set isAuthenticated to false
  dispatchAction(SIGN_IN_RESPONSE, {});

  // Redirect to login page
  window.location.href = './login';
};
