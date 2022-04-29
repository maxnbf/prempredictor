import React, { Fragment } from 'react'
import { Link } from 'react-router-dom'
import { logoutUser } from '../../redux/actions/authActions'
import { Nav, NavRight, NavRightText, NavWelcomeBanner } from './style'


const Navbar = ({username, page}) => {
    return <Nav >
        <NavWelcomeBanner>Welcome, {username}</NavWelcomeBanner>
        <NavRight>
            <NavRightText isSelected={page === 'prediction'} to='/home'><p>My Prediction</p></NavRightText>
            <NavRightText isSelected={page === 'leaderboard'} to='/leaderboard'><p>Leaderboards</p></NavRightText>
            <NavRightText onClick={() => logoutUser()}><p>Logout</p></NavRightText>
        </NavRight>
    </Nav>
}

export default Navbar