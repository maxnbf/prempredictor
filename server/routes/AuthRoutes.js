const Router = require('express')
// import { fetchAndRespond } from "./Controller";
const AuthService = require('../services/AuthService')


function fetchAndRespond(serviceMethod) {
    return function (request, response, next) {
        serviceMethod(request)
            .then((docs) => response.status(200).json(docs))
            .catch((err) => {
                console.log("ERROR", err)
            });
    };
}


const router = Router();

function signup(request) {
    const { username, password, name } = request.body;
    return AuthService.signup(username, password, name);
}

function signin(request) {
    const { username, password } = request.body;
    return AuthService.signin(username, password);
}

router.post("/signup", fetchAndRespond(signup));
router.post("/signin", fetchAndRespond(signin));

module.exports = router;