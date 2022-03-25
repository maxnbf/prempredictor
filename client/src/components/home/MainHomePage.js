import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { logoutUser } from '../../redux/actions/authActions';
import logos from '../../teamlogos/logodict';

import "./CompareTable.css"
const MainHomePage = ({live, ranking, username}) => {

    const user = useSelector(state => state.auth.user_info)
    return (
    <div>
       
        <div className="main-navbar">
            <div className="welcome-banner">Welcome, {user.name}</div>
            {/*show their prediction*/}
            <Link className="prediction-link selected" to='/home'>My Prediction</Link>

            {/*show the overall points leaderboard, community prediction, and favorite team leaderboard*/} 
            <Link className="leaderboard-link" to='/leaderboard'>Leaderboards</Link> 
            <div className="logout-button" onClick={() => logoutUser()}>Logout</div>  
        </div>

        <div className="home-content-container">
            <div className="named-prediction-header">@{username ? username : user.username}'s predictions</div>
            <table className="compare-table">
                <tr>
                    <td>

                    </td>
                    <td className="compare-table-live-team">
                        Live Table
                    </td>
                    <td className="compare-table-predicted-team">
                        Predicitons
                    </td>
                    <td className="compare-table-points">
                        Points
                    </td>

                </tr>
                {ranking.ranking.map((team, index) => {
                    
                    let row_styling;

                    if (index === 0) {
                        row_styling = "compare-table-champions"
                    } else if (index >=1 && index <= 3) {
                        row_styling = "compare-table-top-four"
                    } else if (index >= 17) {
                        row_styling = "compare-table-relegation"
                    } else {
                        row_styling = "compare-table-other"
                    }

                    let points = ranking.points[index];
                    let point_styling;

                    if (points === 0) {
                        point_styling = 'zero_points'
                    } else if (points > 0) {
                        point_styling = 'positive_points'
                    } else {
                        point_styling = 'negative_points'
                    }

                    return (
                    <tr className="compare-table-row" key = {index}>
                        <td className={`compare-table-ranking ${row_styling}`}>{index + 1}</td>
                        <td className={`compare-table-live-team  ${row_styling}`}>
                            <div className="compare-table-cell">
                                <div>{live?.table[index]}</div>
                                <div className="compare-table-logo">{logos[live?.table[index]]}</div>
                            </div>
                        </td>
                        <td className={`compare-table-predicted-team ${row_styling}`}>
                            <div className="compare-table-cell">
                                <div>{team}</div>
                                <div className="compare-table-logo">{logos[team]}</div>
                            </div>
                        </td>
                        <td className={`compare-table-points ${point_styling}`}>{points>0 && '+'}{points}</td>
                    </tr>)
                })}
                <tr>
                    <td></td>
                    <td></td>
                    <td>Total points:</td>
                    <td>{ranking.total_points}</td>
                </tr>
            </table>
        </div>

     
    </div>)
}

export default MainHomePage