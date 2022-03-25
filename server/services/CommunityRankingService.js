const CommunityRanking = require("../models/CommunityRankingModel")

class CommunityRankingService {
    static async updateCommunityRanking(user_ranking) {
        const comm = await CommunityRanking.find().exec()
        const list = comm[0].teams
        const num_rankings = comm[0].num_rankings

        const new_list = list.map((team_obj) => {
             return {team: team_obj.team, ranking: ((team_obj.ranking * num_rankings) + user_ranking.indexOf(team_obj.team) + 1) / (num_rankings + 1)}
        })

        comm[0].teams = new_list
        comm[0].num_rankings = num_rankings + 1
        comm[0].save()
    }

    static async getCommunityRanking() {
        const ranking = await CommunityRanking.find().exec()
        const teams = ranking[0].teams

        teams.sort(function(a, b) {
            if (a.ranking < b.ranking) return -1;
            if (a.ranking > b.ranking) return 1;
            return 0;
          });
        return teams
    }
}

module.exports = CommunityRankingService