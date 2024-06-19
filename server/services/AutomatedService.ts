import { LiveTable } from "../models/liveTableModel";

export async function updateLiveTable() {
  // const live = await LiveTable.find();
  // if (live.length === 0) {
  //     LiveTable.create({table: def})
  // } else {
  //     const options = {
  //     method: 'GET',
  //     url: 'https://heisenbug-premier-league-live-scores-v1.p.rapidapi.com/api/premierleague/table',
  //     headers: {
  //         'x-rapidapi-host': 'heisenbug-premier-league-live-scores-v1.p.rapidapi.com',
  //         'x-rapidapi-key': '1c57e02111msh788bcae97a8aa2bp1fe287jsnb14f5e2f0780',
  //         useQueryString: true
  //     }
  //     };
  //     request(options, function (error, response, body) {
  //         if (error) throw new Error(error);
  //         let r = JSON.parse(body)
  //         r = r["records"]
  //         let live_ranking = []
  //         r.map((team) => live_ranking.push(team.team))
  //         live[0].table = live_ranking
  //         live[0].save()
  //     });
  // }
  // //updates and saves points for each ranking
  // const usersRankings = await Ranking.find().exec()
  // usersRankings.map(ranking => RankingService.updatePoints(ranking, live[0].table))
}
