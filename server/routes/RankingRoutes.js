const Router = require('express')
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

    console.log(request.user)
    return RankingService.makeRanking(request.user._id, ranking);
}

function getRanking(request) {
    const { id } = request.body;
    return RankingService.getRanking(id);

}

router.post("/ranking", fetchAndRespond(makeRanking));
router.get("/:id/ranking", fetchAndRespond(getRanking));

module.exports = router;