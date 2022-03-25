const LiveTable = require("../models/LiveTableModel");
const Ranking = require("../models/RankingModel");
const User = require("../models/UserModel");
const CommunityRankingService = require("./CommunityRankingService");

class RankingService {
    static async makeRanking(id, username, user_ranking, favorite_team) {

        //gets the live table
        const live = await LiveTable.find().exec()
        const table = live[0].table

        //calculates points based on the table
        let points = []
        user_ranking.forEach((team, index) => points.push(index - table.indexOf(team)))
        const sum = points.reduce((acc, a) => {return acc+Math.abs(a)}, 0);

        //adds favorite team to this user
        let user = await User.findOne({username: username}).exec()
        if (favorite_team) {
            user.favorite_team = favorite_team
        }
        user.save()


        //Updates Community Ranking
        CommunityRankingService.updateCommunityRanking(user_ranking)

        return await Ranking.create({owner: id, username: username, ranking: user_ranking, points: points, total_points: sum, favorite_team: favorite_team})
    }

    static async updatePoints(rankingModel, live) {
        //adds the array of points to this instance of the model
        let new_points = []
        rankingModel.ranking.forEach((team, index) => new_points.push(index - live.indexOf(team)))

        console.log('THIS IS BEING RUN')
        rankingModel.points = new_points;

        //sums the points for total score
        const sum = new_points.reduce((acc, a) => {return acc+Math.abs(a)}, 0);
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

    static async getFavRankings(fav) {
        let users = await User.find({favorite_team: fav}).exec()

        let usernames = users.map(user => user.username)
        return await Ranking.find().where('username').in(usernames).exec()
    }
}

module.exports = RankingService