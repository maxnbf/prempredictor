import React, { useState } from "react";
import { registerUser } from "../../redux/actions/authActions";


const Register = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');

    const register = () => {
        registerUser({username: username, password: password, name: name});
    }

    return <div className="register-page-container">
        <div>
            <input className="register-password-input" onChange={(e) => setName(e.target.value)}></input>
        </div>
        <div>
            <input className="register-username-input" onChange={(e) => setUsername(e.target.value)}></input>
        </div>
        <div>
            <input className="register-password-input" onChange={(e) => setPassword(e.target.value)}></input>
        </div>
        <div className="register-button" onClick={() => register()}>Register</div>
    </div>
}

export default Register