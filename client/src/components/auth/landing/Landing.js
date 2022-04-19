import React from "react";
import { LandingContainer, LandingLink, LandingLogo, LandingBanner } from "./style";
import logo from "../../../teamlogos/premlogo.JPG"

const Landing = () => {
    return <LandingContainer className="landing-container">
        <div>
            <LandingBanner>
                <LandingLogo src={logo}/>
            </LandingBanner>
            <LandingLink  to='/login'>
                    Login
            </LandingLink>
            <LandingLink to='/register'>
                Register
            </LandingLink>
        </div>
    </LandingContainer>
}

export default Landing;