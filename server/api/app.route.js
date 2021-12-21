const express = require('express')
const appRoute = express.Router();

const AuthRoute = require('../routes/AuthRoutes.js')

appRoute.use('/auth', AuthRoute)

module.exports = appRoute;