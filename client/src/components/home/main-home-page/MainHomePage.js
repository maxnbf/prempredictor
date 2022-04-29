import React from 'react';
import { useSelector } from 'react-redux';
import Navbar from '../../navbar/Navbar';
import HeaderRow from './header-row/HeaderRow';
import PredictionContent from './prediction-content/PredictionContent';
import { HomeContainer, MyPredictionTable } from './style';
import TotalPointsRow from './total-points-row/TotalPointsRow';

const MainHomePage = ({live, myRanking, otherRanking, username}) => {

    const user = useSelector(state => state.auth.user_info);

    return (
    <div>
       
        <Navbar username={user.name} page={'prediction'} ></Navbar>

        <HomeContainer>
            <MyPredictionTable>
                <HeaderRow otherRanking={otherRanking} user={user} username={username} live={live}/>
                <PredictionContent myRanking={myRanking} otherRanking={otherRanking} live={live} />
                <TotalPointsRow myRanking={myRanking} otherRanking={otherRanking} />
            </MyPredictionTable>
        </HomeContainer>

     
    </div>)
}

export default MainHomePage;