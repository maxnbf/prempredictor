import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { getAllRanking } from '../../redux/actions/rankingActions'
import "./LeaderBoard.css"

const LeaderBoard = () => {
    const name = useSelector(state => state.auth.user_info.name)

    const [leaderboard, setLeaderboard] = useState(null)

    useEffect(() => {
        getAllRanking().then(res => setLeaderboard(res.data))
    },[])

    console.log(leaderboard)

    return <div>
        <div className="welcome-banner">Welcome, {name}</div>
        <hr className="welcome-banner-divider"></hr>
        <div className="menu-buttons">
            <Link className="prediction-link" to='/home'>My Prediction</Link>
            <Link className="leaderboard-link selected" to='/leaderboard'>Leaderboard</Link>
        </div>


        <table className='leaderboard-table'>
            {leaderboard?.map((user, index) => {
                return (
                <tr className="leaderboard-row" key={index}>
                    <td className="leaderboard-row-rank">{index + 1}</td> 
                    <td className="leaderboard-row-username">
                        <Link className="leaderboard-username-link" to={`/home/${user.username}`}>{user.username}</Link>
                    </td> 
                    <td className="leaderboard-row-points">{user.total_points}</td> 
                </tr>)
            })}
        </table>
    </div>
}

export default LeaderBoard