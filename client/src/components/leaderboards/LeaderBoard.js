import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { getAllRanking, getCommunityRanking, getFanRanking } from '../../redux/actions/rankingActions'
import Navbar from '../navbar/Navbar'
import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';

import "./LeaderBoard.css"
import LeaderboardTable from './leaderboard-table/LeaderboardTable'

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

    const options = [
        {value: 'all', label: 'All Users'},
        {value: 'club', label:`${favorite_team}'s Fans`}, 
        {value: 'community', label: 'Community Average'},
        ];
    const defaultOption = options[0];
    const [dropdownLeaderboard, setDropdownLeaderboard] = useState('all')
    const onSelect = (option) => {
        console.log(option.value)
        setDropdownLeaderboard(option.value)
    }

    return <div>
                
        <Navbar username={name} page={'leaderboard'} ></Navbar>
        <Dropdown className="dropdown-body" options={options} onChange={onSelect} value={defaultOption} placeholder="Select an option" />
            
        <div className="leaderboard-containers">
            {dropdownLeaderboard === 'all' && <LeaderboardTable leaderboard={leaderboard} />}
            {dropdownLeaderboard === 'club' && <LeaderboardTable leaderboard={favLeaderboard} />}

            {dropdownLeaderboard === 'community' && 
            <div className="community-leaderboard">
                    <div className="leaderboard-header">Community Average Ranking</div>
                    <table className='leaderboard-table'>
                        {commRanking?.map((team) => {
                            return (
                            <tr className="leaderboard-row" key={team.ranking}>
                                <td className="leaderboard-row-rank">{Number.parseFloat(team.ranking).toFixed(2)}</td> 
                                <td className="leaderboard-row-username">
                                    {team.team}
                                </td> 
                            </tr>)
                        })}
                    </table>
                </div>
                }
        </div>
    </div>
}

export default LeaderBoard