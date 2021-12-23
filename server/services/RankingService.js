const Ranking = require("../models/RankingModel");

class RankingService {
    static async makeRanking(id, ranking){
        return await Ranking.create({id, ranking})
    }

    static async getRanking(id) {
        return await Ranking.findById(id).exec();
    }
}

module.exports = RankingService