import React, { useState } from "react";
import { Link } from "react-router-dom";
import { registerUser } from "../../redux/actions/authActions";


const Register = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [password2, setPassword2] = useState('');
    const [name, setName] = useState('');

    const register = () => {
        if (password===password2) {
            registerUser({username: username, password: password, name: name});
        } else {
            console.log('passwords don`t match')
        }
    }

    return <div className="register-page-container">
        <div className="register-header">
            Enter details to register an account
        </div>
        <div>
            <input placeholder='Name' className="register-name-input"  onChange={(e) => setName(e.target.value)}></input>
        </div>
        <div>
            <input placeholder='Username'className="register-username-input" onChange={(e) => setUsername(e.target.value)}></input>
        </div>
        <div>
            <input placeholder='Password' className="register-password-input" onChange={(e) => setPassword(e.target.value)}></input>
        </div>
        <div>
            <input placeholder='Confirm Password' className="register-password-input" onChange={(e) => setPassword2(e.target.value)}></input>
        </div>
        <div className="register-button-row"><div className="register-button-area"  onClick={() => register()}>Register Account</div> or <Link to="/login">Login here</Link></div>
    </div>
}

export default Register