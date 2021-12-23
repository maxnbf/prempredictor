import React, { useEffect, useState } from 'react'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import { liveTable, makeRanking } from '../../redux/actions/rankingActions'
import SetOrder from '../SetOrder/SetOrder'
import "./Home.css"

const globalTeams = ['Arsenal', 'Aston Villa', 'Brentford', 'Brighton and Hove Albion', 'Burnley', 'Chelsea', 'Crystal Palace', 'Everton', 'Leeds', 'Leicester', 'Liverpool', 'Manchester City', 'Manchester United', 'Newcastle', 'Norwich', 'Southampton', 'Tottenham Hotspurs', 'Watford', 'West Ham', 'Wolves']
    
const Home = () => {

    
    const [teams, setTeams] = useState(globalTeams)

    const newUser = true;
    //if a new user 
    const saveTable = () => {
        makeRanking(teams)
    }

    if (newUser) {
        return (
        <div className="set-order-view">
            <div className="set-order-left">
                <div className="set-order-left-content">
                    <div>Welcome to Premier League Predictor!</div>
                    <div>Drag and drop the teams to the right to make your predicted final standings</div>
                    <div>Click 'Save' when done</div>
                </div>
            </div>
            <SetOrder className="set-order-center" teams={teams} setTeams={setTeams}/>
            <div className="set-order-right">
                <div className="set-order-right-content">
                   <div onClick={() => saveTable()}>Save</div>
                </div>
            </div>
        </div>)
    }


    return <div>Welcome Back!</div>
}


    // const [liveTeams, setLiveTable] = useState(null)
    // useEffect(() => {
    //     liveTable().then(res => setLiveTable(res.records))
    // }, [])

    // console.log('LIVE TEAMS', liveTeams)

export default Home