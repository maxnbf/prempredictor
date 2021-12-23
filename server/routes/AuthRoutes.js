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
    console.log(request.body)
    const { username, password, name } = request.body;
    return AuthService.signup(username, password, name);
}

function signin(request) {
    const { username, password } = request.body;
    const ret = AuthService.signin(username, password);
    console.log('RET', ret);
    return ret
}

router.post("/signup", fetchAndRespond(signup));
router.post("/signin", fetchAndRespond(signin));

module.exports = router;