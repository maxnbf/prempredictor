import { Friends } from "../models/friendModel";
import { LiveTable } from "../models/liveTableModel";
import { UserRanking } from "../models/userRankingModel";

export async function makeRankingService(username, ranking) {
    const live = await LiveTable.findOne()
    const table = live?.ranking

    if (table == undefined) {
        return false;
    }

    const total = calculateScore(ranking, table)
    const userRanking = await new UserRanking({username, ranking, total})
    userRanking.save()

    return userRanking;
}

export async function getUsersByFavoriteService(favorite) {
    const rankings = await UserRanking.find({ favorite });
    rankings.sort(function (a, b) {
        if (a.total < b.total) return -1;
        if (a.total > b.total) return 1;
        return 0;
    });
    
    return rankings
}


export async function updatePointsService(rankingModel, live) {
    const total = calculateScore(rankingModel.ranking, live)
    // const points = rankingModel.ranking.map((team, index) => index - live.indexOf(team))
    // const total = points.reduce((acc, a) => {return acc+Math.abs(a)}, 0);
    rankingModel.total = total;
    rankingModel.save()
}

export async function getRankingService(username) {
    return await UserRanking.findOne({username: username});
}

export async function getAllService() {
    const rankings = await UserRanking.find();

    rankings.sort(function(a, b) {
        if (a.total < b.total) return -1;
        if (a.total > b.total) return 1;
        return 0;
        });

    return rankings;
}

export async function getLiveRankingForGameWeekService(gameWeek) {
      const liveTable = await LiveTable.findOne({ currentRound: gameWeek });

      if (!liveTable) {
        throw new Error("Some data is missing");
      }
  
      return liveTable
}

export async function getTimeSeriesPointsService(username) {
      const userRanking = await UserRanking.findOne({ username });

      if (!userRanking) {
          throw new Error("User ranking not found");
      }

      const liveTables = await LiveTable.find();
      const scores = [];

      for (const liveTable of liveTables) {
          const score = calculateScore(userRanking.ranking, liveTable.ranking);
          scores.push({
              currentRound: liveTable.currentRound,
              score,
          });
      }
    
      scores.sort((a, b) => a.currentRound - b.currentRound);

      return scores; 
}

export async function getAllFriendRankingsService(username) {
    const results = await Friends.find({
        $or: [
          { from: username },
          { to: username }
        ]
    });
      
    // Get all friends usernames, plus your own
    const usernames = results.map(doc => doc.from === username ? doc.to : doc.from);
    usernames.push(username)

    const rankings = await UserRanking.find({
        username: { $in: usernames }
    });
    
    rankings.sort(function(a, b) {
        if (a.total < b.total) return -1;
        if (a.total > b.total) return 1;
        return 0;
        });

    return rankings;
}

// Function to calculate the score
const calculateScore = (userRanking: string[], liveRanking: string[]) => {
    let score = 0;
 
    userRanking.forEach((team, index) => {
        const liveIndex = liveRanking.indexOf(team);
        if (liveIndex !== -1) {
            const diff = Math.abs(liveIndex - index);
            score += diff;
        }
    });

    return score;
};