import { Friends } from "../models/friendModel";
import { LiveTable } from "../models/liveTableModel";
import { UserRanking } from "../models/userRankingModel";
import { UserScore } from "../types/types";

export async function makeRankingService(username, ranking) {
    const live = await LiveTable.findOne().sort({ currentRound: -1 });;
    const table = live?.ranking

    if (table == undefined) {
        return false;
    }

    const total = calculateScore(ranking, table)
    // If the week is complete, say the user started at the next round
    const userRanking = await new UserRanking({username, ranking, total, weekStarted: live.isWeekComplete ? live.currentRound + 1 : live.currentRound}).save();
    userRanking.save()

    return userRanking;
}

export async function getUsersByFavoriteService(favorite): Promise<UserScore[]> {
    const rankings = await UserRanking.find({ favorite }).lean();
    rankings.sort(function (a, b) {
        if (a.total < b.total) return -1;
        if (a.total > b.total) return 1;
        return 0;
    });
    
    return rankings.map(ranking => ({ username: ranking.username, score: ranking.total, favorite: ranking.favorite }));
}


export async function updatePointsService(rankingModel, live) {
    rankingModel.total = calculateScore(rankingModel.ranking, live);
    rankingModel.save()
}

export async function getRankingService(username) {
    return await UserRanking.findOne({username: username});
}

export async function getAllService(): Promise<UserScore[]> {
    const rankings = await UserRanking.find().lean();

    rankings.sort(function(a, b) {
        if (a.total < b.total) return -1;
        if (a.total > b.total) return 1;
        return 0;
        });

    return rankings.map(ranking => ({ username: ranking.username, score: ranking.total, favorite: ranking.favorite }));
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

export async function getAllFriendRankingsService(username): Promise<UserScore[]> {
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
    }).lean();
    
    rankings.sort(function(a, b) {
        if (a.total < b.total) return -1;
        if (a.total > b.total) return 1;
        return 0;
        });

    return rankings.map(ranking => ({ username: ranking.username, score: ranking.total, favorite: ranking.favorite }));
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