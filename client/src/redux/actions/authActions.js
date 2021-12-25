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

            const { username, _id, name } = res.data.user;
            localStorage.setItem("username", username);
            localStorage.setItem('name', name)
            localStorage.setItem("id", _id);

            setAuthToken(token);



            dispatchAction(SIGN_IN_RESPONSE, {username: username, id: _id, name: name});


            window.href="/home";
      

        })
        .catch((err) => {
            console.log("FAILED SIGN IN", err)
        });
};

// Register User
export const registerUser = (userData) => {
    // Reset any errors that may have occured in previous signup attempts
    axios
        .post("http://localhost:5000/api/auth/signup", userData)
        .then((res) => {
            //res includes all user info
            window.location.href='/login'
        })
        .catch((err) => {
            console.log('ERROR', err)
        });
};


export const logoutUser = () => {
    localStorage.removeItem("jwtToken");
    console.log('hello')
    window.location.href='./login';
}