import axios from 'axios'
import { useHistory } from 'react-router-dom';
import { SIGN_IN_RESPONSE } from '../types/authTypes';
import setAuthToken from './setAuthToken';
import { dispatchAction } from './utilActions';



export const loginUser = (userData) => {
    axios
        .post("http://localhost:5000/api/auth/signin", userData)
        .then((res) => {
            
            console.log(res);
            const { token } = res.data;
            localStorage.setItem("jwtToken", token);
            const username = res.data.user.username;
            localStorage.setItem("username", username);

            setAuthToken(token);

            dispatchAction(SIGN_IN_RESPONSE, {username: username});


            window.href="/home";
      

        })
        .catch((err) => {
            console.log("FAILED SIGN IN", err)
        });
};

// Register User
export const registerUser = (userData, history) => {
    console.log(userData);
    // Reset any errors that may have occured in previous signup attempts
    axios
        .post("http://localhost:5000/api/auth/signup", userData)
        .then((res) => {
            // re-direct to login on successful register
            console.log(res)

            //window.location.href='/login'
        })
        .catch((err) => {
            console.log('ERROR', err)
        });
};