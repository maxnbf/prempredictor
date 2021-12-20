import React from "react";
import { Link } from "react-router-dom";
import './auth.css'

const Landing = () => {
    return (<div className="landing-container">
        <div className="landing-content">
            <div>
                Premier League Standings Predictor
            </div>
            <div><Link to='/login'>
                Login
            </Link>
            </div>
            <div>
            <Link to='/register'>
                Register
            </Link>
            </div>
        </div>
    </div>)
}

export default Landing