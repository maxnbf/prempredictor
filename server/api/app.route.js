const express = require('express')
const appRoute = express.Router();

const AuthRoute = require('../routes/AuthRoutes.js')


appRoute.get('/', (req, res) => {
    res.send('hello world')
})
appRoute.use('/auth', AuthRoute)


module.exports = appRoute;