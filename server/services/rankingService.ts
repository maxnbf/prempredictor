import { LiveTable } from "../models/liveTableModel";
import { UserRanking } from "../models/userRankingModel";



export async function makeRanking(username, ranking, favorite) {
    const live = await LiveTable.findOne()
    const table = live?.ranking

    if (table == undefined) {
        return false;
    }

    const points = ranking.map((team, index) => index - table.indexOf(team))
    const total = points.reduce((acc, a) => {return acc+Math.abs(a)}, 0);

    const userRanking = await new UserRanking({username, ranking, points, total, favorite})
    userRanking.save()

    return userRanking;
}

export async function updatePoints(rankingModel, live) {
    //adds the array of points to this instance of the model
    const points = rankingModel.ranking.map((team, index) => index - live.indexOf(team))

    console.log('THIS IS BEING RUN')
    rankingModel.points = points;

    //sums the points for total score
    const total = points.reduce((acc, a) => {return acc+Math.abs(a)}, 0);
    rankingModel.total = total;

    rankingModel.save()
}

export async function getRanking(username) {
    return await UserRanking.findOne({username: username});
}

export async function getAll() {
    const rankings = await UserRanking.find();

    rankings.sort(function(a, b) {
        if (a.total < b.total) return -1;
        if (a.total > b.total) return 1;
        return 0;
        });

    console.log(rankings)
    return rankings;
}
