import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { logoutUser } from '../../redux/actions/authActions';
import "./CompareTable.css"
const MainHomePage = ({live, ranking, username}) => {

    const name = useSelector(state => state.auth.user_info.name)
    return (
    <div>
        <div>
            <div className="welcome-banner">Welcome, {name}</div>
            {username && <div>You are viewing {username}'s profile</div>}
            <div onClick={() => logoutUser()}>logout</div>
            <hr className="welcome-banner-divider"></hr>
            <div className="menu-buttons">
                <Link className="prediction-link selected" to='/home'>Prediction</Link>
                <Link className="leaderboard-link" to='/leaderboard'>Leaderboard</Link>
            </div>
        </div>
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
                    <td className="compare-table-live-team">{live?.table[index]}</td>
                    <td className="compare-table-predicted-team">{team}</td>
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