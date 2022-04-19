import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import { loginUser } from "../../../redux/actions/authActions";
import { LoginButton, LoginButtonRow, LoginContainer, LoginHeader, LoginInput, LoginLogo, LoginBanner, LoginBody, NotAMember } from "./style";
import logo from "../../../teamlogos/premlogo.JPG"

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

    return <LoginContainer>
        <LoginBanner>
            <LoginLogo src={logo}/>
        </LoginBanner>
        <LoginBody>
            <LoginHeader>
                Sign In
            </LoginHeader>
            <div>
                <LoginInput placeholder="Username"onChange={(e) => setUsername(e.target.value)}></LoginInput>
            </div>
            <div>
                <LoginInput placeholder="Password" onChange={(e) => setPassword(e.target.value)}></LoginInput>
            </div>
            <LoginButtonRow>
                <LoginButton onClick={() => login()}>Login</LoginButton>
                <NotAMember>Not a member? <Link to="/register">Sign up</Link></NotAMember>
            </LoginButtonRow>
        </LoginBody>
    </LoginContainer>
}

export default Login;