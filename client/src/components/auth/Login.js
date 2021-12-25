import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import { loginUser } from "../../redux/actions/authActions";


const Login = () => {

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const isAuthenticated = useSelector(state => state.auth.isAuthenticated)
    const history = useHistory()
    
    if (isAuthenticated) {
        history.push('/home')
    }

    const login = () => {
        loginUser({username: username, password: password});
    }

    return <div className="login-page-container">
        <div className="login-header">
            Enter details to log in
        </div>
        <div>
            <input placeholder="Username" className="login-username-input" onChange={(e) => setUsername(e.target.value)}></input>
        </div>
        <div>
            <input placeholder="Password" className="login-password-input" onChange={(e) => setPassword(e.target.value)}></input>
        </div>
        <div className="login-button-row"><div className="login-button-area"  onClick={() => login()}>Login</div> or <Link to="/register">Register here</Link></div>
    </div>
}

export default Login;