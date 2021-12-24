const express = require('express')
const appRoute = express.Router();

const AuthRoute = require('../routes/AuthRoutes.js')
const RankingRoute = require('../routes/RankingRoutes.js')

appRoute.get('/', (req, res) => {
    res.send('hello world')
})

appRoute.use('/auth', AuthRoute)
appRoute.use('/ranking', RankingRoute)


module.exports = appRoute;

