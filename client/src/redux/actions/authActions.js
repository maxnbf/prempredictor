import axios from "axios";
import { SIGN_IN_RESPONSE } from "../types/authTypes";
import setAuthToken from "./setAuthToken";
import { dispatchAction } from "./utilActions";

export const loginUser = (userData) => {
  axios
    .post("http://localhost:9000/auth/signin", userData)
    .then((res) => {
      const { token } = res.data;
      localStorage.setItem("jwtToken", token);

      const { username } = res.data;
      localStorage.setItem("username", username);
      setAuthToken(token);

      dispatchAction(SIGN_IN_RESPONSE, {
        username: username,
      });

      window.href = "/home";
    })
    .catch((err) => {
      console.log("FAILED SIGN IN", err);
    });
};

// Register User
export const registerUser = (userData) => {
  // Reset any errors that may have occured in previous signup attempts
  axios
    .post("http://localhost:9000/auth/signup", userData)
    .then((res) => {
      //res includes all user info
      window.location.href = "/login";
    })
    .catch((err) => {
      console.log("ERROR", err);
    });
};

export const logoutUser = () => {
  localStorage.removeItem("jwtToken");
  localStorage.removeItem("username");

  // Remove auth header for future requests
  setAuthToken(false);
  // Set current user to empty object {} which will set isAuthenticated to false
  dispatchAction(SIGN_IN_RESPONSE, {});
  // Redirect to login
  window.location.href = "./login";
};
