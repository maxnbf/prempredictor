import React, { useState } from "react";
import { loginUser } from "../../redux/actions/authActions";


const Login = () => {

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const login = () => {
        loginUser({username: username, password: password});
    }

    return <div className="login-page-container">
        <div>
            <input className="login-username-input" onChange={(e) => setUsername(e.target.value)}></input>
        </div>
        <div>
            <input className="login-password-input" onChange={(e) => setPassword(e.target.value)}></input>
        </div>
        <div className="login-button" onClick={() => login()}>Login</div>
    </div>
}

export default Login;