import axios from 'axios'
import { useHistory } from 'react-router-dom';
import setAuthToken from './setAuthToken';



export const loginUser = (userData) => {
    axios
        .post("http://localhost:5000/api/auth/signin", userData)
        .then((res) => {
            
            console.log(res);
            const { token } = res.data;
            localStorage.setItem("jwtToken", token);
            const username = res.data.user.username;
            localStorage.setItem("username", username);
            // Set token to Auth header
            setAuthToken(token);

            window.location.href='/home'

            // // Decode token to get user data
            // const decoded = jwt_decode(token);

            // decoded["username"] = username;

            // dispatchAction(SET_CURRENT_USER, decoded);

            // //store full user data in fullUser object
            // getAndSetUserState(username);
            // //TODO: catch error and handle properly
        })
        .catch((err) => {
            console.log("FAILED SIGN IN", err)
        });
};

// Register User
export const registerUser = (userData, history) => {

    // Reset any errors that may have occured in previous signup attempts
    axios
        .post("http://localhost:5000/api/auth/signup", userData)
        .then((res) => {
            // re-direct to login on successful register
            console.log(res)

            window.location.href='/login'
        })
        .catch((err) => {
            console.log('ERROR', err)
        });
};