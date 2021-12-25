import React from "react";
import { Link } from "react-router-dom";
import './auth.css'

const Landing = () => {
    return (<div className="landing-container">
        <div className="landing-content">
            <div className="landing-title">
                Premier League Standings Predictor
            </div>
            <div className="landing-link-login">
                <Link to='/login'>
                    Login
                </Link>
            </div>
            <div className="landing-link-register">
                <Link to='/register'>
                    Register
                </Link>
            </div>
        </div>
    </div>)
}

export default Landing