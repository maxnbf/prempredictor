const express = require('express')
const appRoute = express.Router();

const AuthRoute = require('../routes/AuthRoutes.js')
const RankingRoute = require('../routes/RankingRoutes.js')

appRoute.get('/', (req, res) => {
    res.send('hello world')
})

appRoute.use('/auth', AuthRoute)
appRoute.use('/ranking', RankingRoute)


//MAKE AN ENDPOINT THAT RETRIEVES AND CALCULATES ALL USERS AVERAGE PREDICTED TABLE
//--would show TEAM  // AVG GUESS // REAL POSITION

//ALLOW USERS TO PICK A FAVORITE TEAM AND THEN HAVE A TAB WHERE IT RANKS ALL PEOPLE WITH THAT TEAM
//--double click on initial team ordering screen to select team, highlight it in gold
//--if they opt not to pick have them have to select one when they enter the tab and then they can view standings for that club

module.exports = appRoute;

