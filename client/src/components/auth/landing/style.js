
import { Link } from 'react-router-dom';
import styled from 'styled-components';

export const LandingTitle = styled.div`
    font-size: 30px;
    font-weight: bolder;
    padding: 20px;
`;

export const LandingContainer = styled.div`
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: white;
    box-shadow: 0px 0px 10px rgb(0 0 0 / 25%);

    border-radius: 15px;
    padding-bottom: 5px;
`

export const LandingLink = styled(Link)`
    text-align: center;
    padding: 10px;
    font-size: 20px;
    color: black;
    text-decoration: none;
    display: inherit;
    color: #7B63FF;
    font-weight: bold;
   
    
`

export const LandingBanner = styled.div`
    background: #1E1E1E;
    border-top-left-radius: 15px;
    border-top-right-radius: 15px;
    margin-bottom: 5px
`

export const LandingLogo = styled.img`
    max-height: 200px;
    margin-left: 80px;
    margin-right: 80px;    
`