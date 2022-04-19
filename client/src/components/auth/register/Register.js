import React, { useState } from "react";
import { Link } from "react-router-dom";
import { registerUser } from "../../../redux/actions/authActions";
import { AlreadyAMember, RegisterBanner, RegisterBody, RegisterButton, RegisterButtonRow, RegisterContainer, RegisterHeader, RegisterInput, RegisterLogo } from "./style";
import logo from "../../../teamlogos/premlogo.JPG"

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

    return <RegisterContainer>
        <RegisterBanner>
            <RegisterLogo src={logo}/>
        </RegisterBanner>
        <RegisterBody>
            <RegisterHeader>
                Sign up
            </RegisterHeader>
            <div>
                <RegisterInput placeholder='Name'  onChange={(e) => setName(e.target.value)}></RegisterInput>
            </div>
            <div>
                <RegisterInput placeholder='Username' onChange={(e) => setUsername(e.target.value)}></RegisterInput>
            </div>
            <div>
                <RegisterInput placeholder='Password'onChange={(e) => setPassword(e.target.value)}></RegisterInput>
            </div>
            <div>
                <RegisterInput placeholder='Confirm Password' onChange={(e) => setPassword2(e.target.value)}></RegisterInput>
            </div>
            <RegisterButtonRow>
                <RegisterButton onClick={() => register()}>Register Account</RegisterButton> 
                <AlreadyAMember>Already a member? <Link to="/login">Sign in</Link></AlreadyAMember>
            </RegisterButtonRow>
        </RegisterBody>
    </RegisterContainer>
}

export default Register