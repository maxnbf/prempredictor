const Router = require('express')
const jwt = require("jsonwebtoken");
const LiveTable = require('../models/LiveTableModel');
// import { fetchAndRespond } from "./Controller";
const RankingService = require('../services/RankingService')


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

function makeRanking(request) {
    const verified = jwt.verify(request.headers.authorization.substring(7), 'F3A9ADFEB65702D5E9536E2ACA22572DF144C9069ED167C07150C1F122F9D847');
    return RankingService.makeRanking(verified._id, verified.username, request.body);
}

function getRanking(request) {
    return RankingService.getRanking(request.params.username);
}

async function getLive(request) {
    const live = await LiveTable.find().exec()
    return live[0]
}

function getAllRankings(request) {
    return RankingService.getAll();
}

router.post("/ranking", fetchAndRespond(makeRanking));
router.get("/:username/ranking", fetchAndRespond(getRanking));
router.get("/live", fetchAndRespond(getLive));
router.get("/leaderboard", fetchAndRespond(getAllRankings))


module.exports = router;