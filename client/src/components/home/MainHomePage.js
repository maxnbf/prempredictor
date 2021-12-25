import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { logoutUser } from '../../redux/actions/authActions';
import logos from '../../teamlogos/logodict';

import "./CompareTable.css"
const MainHomePage = ({live, ranking, username}) => {

    const name = useSelector(state => state.auth.user_info.name)
    return (
    <div>
       
        <div>
            <div className="welcome-banner">Welcome, {name}</div>
            {username && <div>You are viewing {username}'s profile</div>}
            <div onClick={() => logoutUser()}>logout</div>
            <Link className="prediction-link selected" to='/home'>Prediction</Link>
            <Link className="leaderboard-link" to='/leaderboard'>Leaderboard</Link>
    
            
        </div>
        <hr className="welcome-banner-divider"></hr>
        
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
            {ranking.ranking.map((team, index) => 
                <tr className="compare-table-row" key = {index}>
                    <td className="compare-table-ranking">{index + 1}</td>
                    <td className="compare-table-live-team">
                        <div className="compare-table-cell">
                            <div>{live?.table[index]}</div>
                            <div className="compare-table-logo">{logos[live?.table[index]]}</div>
                        </div>
                    </td>
                    <td className="compare-table-predicted-team">
                        <div className="compare-table-cell">
                            <div>{team}</div>
                            <div className="compare-table-logo">{logos[team]}</div>
                        </div>
                    </td>
                    <td className="compare-table-points">{ranking.points[index]}</td>
                </tr>
            )}
            <tr>
                <td></td>
                <td></td>
                <td>Total points:</td>
                <td>{ranking.total_points}</td>
            </tr>
        </table>

     
    </div>)
}

export default MainHomePage