const LiveTable = require("../models/LiveTableModel");
const Ranking = require("../models/RankingModel");

class RankingService {
    static async makeRanking(id, username, ranking) {
        const live = await LiveTable.find().exec()
        const table = live[0].table
        let points = []

        ranking.forEach((team, index) => points.push(Math.abs(index - table.indexOf(team))))

        const sum = points.reduce((acc, a) => {return acc+a}, 0);
        return await Ranking.create({owner: id, username: username, ranking: ranking, points: points, total_points: sum})
    }

    static async updatePoints(rankingModel, live) {
        let new_points = []
        rankingModel.ranking.forEach((team, index) => new_points.push(Math.abs(index - live.indexOf(team))))

        rankingModel.points = new_points;

        const sum = new_points.reduce((acc, a) => {return acc+a}, 0);
        rankingModel.total_points = sum;
        rankingModel.save()
    }

    static async getRanking(username) {
        return await Ranking.findOne({username: username}).exec();
    }

    static async getAll() {
        let rankings = await Ranking.find().exec();

        rankings.sort(function(a, b) {
            if (a.total_points < b.total_points) return -1;
            if (a.total_points > b.total_points) return 1;
            return 0;
          });
        return rankings
    }
}

module.exports = RankingService