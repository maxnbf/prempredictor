import React, { useState } from 'react'
import { makeRanking } from '../../redux/actions/rankingActions'
import SetOrder from '../SetOrder/SetOrder'

const globalTeams = ['Arsenal', 'Aston Villa', 'Brentford', 'Brighton', 'Burnley', 'Chelsea', 'Crystal Palace', 'Everton', 'Leeds', 'Leicester', 'Liverpool', 'Manchester City', 'Manchester United', 'Newcastle United', 'Norwich', 'Southampton', 'Tottenham', 'Watford', 'West Ham', 'Wolverhampton Wanderers']
    
const NewUserHomePage = () => {

    const [teams, setTeams] = useState(globalTeams)
    const [favorite, setFavorite] = useState(null);
    const saveTable = () => {
        let body = {ranking: teams};
        if (favorite) {
            body['favorite_team'] = favorite
        }
        localStorage.setItem("favorite_team", favorite);

        makeRanking(body)
        window.location.reload()
    }

    return (
        <div className="set-order-view">
            <div className="set-order-left">
                <div className="set-order-left-content">
                    <div>Welcome to Premier League Predictor!</div>
                    <div>Drag and drop the teams to the right to make your predicted final standings</div>
                    <div>Double click a team to select them as your favorite team</div>
                    <div>Click 'Save' when done</div>
                </div>
            </div>
            <SetOrder className="set-order-center" teams={teams} setTeams={setTeams} favorite={favorite} setFavorite={setFavorite}/>
            <div className="set-order-right">
                <div className="set-order-right-content">
                   <div onClick={() => saveTable()}>Save</div>
                </div>
            </div>
        </div>)
}


export default NewUserHomePage