import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { logoutUser } from '../../redux/actions/authActions'
import { getAllRanking, getCommunityRanking, getFanRanking } from '../../redux/actions/rankingActions'
import logos from '../../teamlogos/logodict'
import "./LeaderBoard.css"

const LeaderBoard = () => {
    const { name, favorite_team } = useSelector(state => state.auth.user_info)

    const [leaderboard, setLeaderboard] = useState(null)
    const [favLeaderboard, setFavLeaderboard] = useState(null)
    const [commRanking, setCommRanking] = useState(null)

    useEffect(() => {
        getAllRanking().then(res => setLeaderboard(res.data))
        getFanRanking(favorite_team).then(res => setFavLeaderboard(res.data))
        getCommunityRanking().then(res => setCommRanking(res.data))
    }, [])

    return <div>
         <div className="main-navbar">
            <div className="welcome-banner">Welcome, {name}</div>
            {/*show their prediction*/}
            <Link className="prediction-link" to='/home'>My Prediction</Link>

            {/*show the overall points leaderboard, community prediction, and favorite team leaderboard*/} 
            <Link className="leaderboard-link selected" to='/leaderboard'>Leaderboards</Link> 
            <div className="logout-button" onClick={() => logoutUser()}>Logout</div>  
        </div>

        <div className="leaderboard-containers">
            <div className="overall-leaderboard">
                <div className="leaderboard-header">All users scores</div>
                <table className='leaderboard-table'>
                    {leaderboard?.map((user, index) => {
                        return (
                        <tr className="leaderboard-row" key={index}>
                            <td className="leaderboard-row-rank">{index + 1}</td> 
                            <td className="leaderboard-row-username">
                                <Link className="leaderboard-username-link" to={`/home/${user.username}`}>{user.username}</Link>
                                <div className="compare-table-logo">{logos[user.favorite_team]}</div>
                            </td> 
                            <td className="leaderboard-row-points">{user.total_points}</td> 
                        </tr>)
                    })}
                </table>
            </div>

            <div>
                <div className="leaderboard-header">All {favorite_team}'s fan scores</div>
                <table className='leaderboard-table'>
                    {favLeaderboard?.map((user, index) => {
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

            <div>
                <div className="leaderboard-header">Community Average Ranking</div>
                <table className='leaderboard-table'>
                    {commRanking?.map((team) => {
                        return (
                        <tr className="leaderboard-row" key={team.ranking}>
                            <td className="leaderboard-row-rank">{Number.parseFloat(team.ranking).toFixed(2)}</td> 
                            <td className="leaderboard-row-username">
                                {team.team}
                                {/* <Link className="leaderboard-username-link" to={`/home/${user.username}`}>{user.username}</Link> */}
                            </td> 
                        </tr>)
                    })}
                </table>
            </div>
        </div>
    </div>
}

export default LeaderBoard