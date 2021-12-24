import React, { useEffect, useState } from 'react'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { liveTable, makeRanking, getRanking, getLiveRanking } from '../../redux/actions/rankingActions'
import SetOrder from '../SetOrder/SetOrder'
import "./Home.css"
import MainHomePage from './MainHomePage'
import NewUserHomePage from './NewUserHomePage'


const Home = () => {

    const [ownRanking, setOwnRanking] = useState(undefined)
    const [live, setLive] = useState(undefined)
    const ownUsername = useSelector(state => state.auth.user_info.username)


    const { username } = useParams()

    useEffect(() => {
        console.log('hello')
        getRanking(username ? username : ownUsername).then(res => setOwnRanking(res.data))

        getLiveRanking().then(res => setLive(res.data))
    }, [ownUsername, username])

    console.log(username, ownRanking)

    
    if (ownRanking) {
        return <MainHomePage live={live} ranking={ownRanking} username={username}/>
    } else if (ownRanking === null) {
        return <NewUserHomePage/>
    } else {
        return <div></div>
    }


}


    // const [liveTeams, setLiveTable] = useState(null)
    // useEffect(() => {
    //     liveTable().then(res => setLiveTable(res.records))
    // }, [])

    // console.log('LIVE TEAMS', liveTeams)

export default Home