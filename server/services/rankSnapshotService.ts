import { Friends } from "../models/friendModel";
import { UserRanking } from "../models/userRankingModel";
import { UserRankSnapshot } from "../models/userRankSnapshotModel";
import { PlayerStats } from "../models/playerStatsModel";
import { LiveTable } from "../models/liveTableModel";

export const getRankingSnapshotService = async (username: string) => {
    const snapshot = await UserRankSnapshot.findOne({ username }).lean();
    const topLevel = await PlayerStats.findOne({}).lean();
    const myRanking = await UserRanking.findOne({ username }).lean();
    const currentGameWeek = await LiveTable.findOne({}).sort({ currentRound: -1 }).lean();
    
    return { ...snapshot, ...topLevel, myPoints: myRanking.total, currentGameWeek: currentGameWeek.currentRound};
}

export const assignTopLevelStatsService = async () => {
    const results = await UserRanking.aggregate([
        {
          $facet: {
            average: [
                { $group: { _id: null, averagePoints: { $avg: "$total" } } },
                { $project: { averagePoints: { $round: ["$averagePoints", 0] } } }
              ],
            lowest: [
              { $group: { _id: null, minPoints: { $min: "$total" } } },
            ],
          },
        },
        { $unwind: "$average" },
        { $unwind: "$lowest" },
        {
          $lookup: {
            from: "userrankings",
            let: { minPoints: "$lowest.minPoints" },
            pipeline: [
              { $match: { $expr: { $eq: ["$total", "$$minPoints"] } } },
              { $sample: { size: 1 } },
            ],
            as: "lowestUser",
          },
        },
        { $unwind: "$lowestUser" },
        {
          $project: {
            averagePoints: "$average.averagePoints",
            lowestPoints: {
              username: "$lowestUser.username",
              points: "$lowestUser.total",
            },
          },
        },
      ]);
    
      const data = results[0];
    
    await PlayerStats.deleteMany({}); 
    await PlayerStats.create(data);

}

export const assignFriendRankService = async () => {
  const friendships = await Friends.find().lean();

  const friendMap = new Map<string, Set<string>>();

  for (const { from, to } of friendships) {
    if (!friendMap.has(from)) friendMap.set(from, new Set());
    if (!friendMap.has(to)) friendMap.set(to, new Set());
    friendMap.get(from)!.add(to);
    friendMap.get(to)!.add(from); // make it bidirectional
  }

  const allUsers = await UserRanking.find().lean();

  const usernameToPoints = new Map<string, number>();
  allUsers.forEach((u) => {
    usernameToPoints.set(u.username, u.total);
  });

  const updates = [];

  for (const user of allUsers) {
    const group = new Set<string>();
    group.add(user.username); // include self

    const friends = friendMap.get(user.username);
    if (friends) {
      friends.forEach((f) => group.add(f));
    }

    // Get [username, total] of each group member
    const groupScores = Array.from(group)
      .map((username) => ({
        username,
        total: usernameToPoints.get(username) ?? 0,
      }))
      .sort((a, b) => a.total - b.total);

    // Assign rank within group
    let lastScore = null;
    let currentRank = 1;
    const rankMap = new Map<string, number>();

    groupScores.forEach((entry, i) => {
      if (entry.total !== lastScore) {
        currentRank = i + 1;
        lastScore = entry.total;
      }
      rankMap.set(entry.username, currentRank);
    });

    // Update current user's rank
    updates.push({
      updateOne: {
        filter: { username: user.username },
        update: { $set: { friendsRank: rankMap.get(user.username) } },
        upsert: true,
      }
    });
  }

   await UserRankSnapshot.bulkWrite(updates);
}


export const assignFavoriteTeamRankService = async () => {
    const rankedByFavorite = await UserRanking.aggregate([
        {
          $setWindowFields: {
            partitionBy: "$favorite", // Group by favorite team
            sortBy: { total: 1 },    // Rank by total points (descending)
            output: {
              rank: { $rank: {} }     // Compute rank within each favorite group
            }
          }
        },
        {
          $project: {
            username: 1,
            favorite: 1,
            total: 1,
            rank: 1
          }
        }
      ]);
    
      // Bulk write updates into UserRankSnapshot
      const bulkOps = rankedByFavorite.map((user) => ({
        updateOne: {
          filter: { username: user.username },
          update: { $set: { favoriteTeamRank: user.rank } },
          upsert: true
        }
      }));
    

    await UserRankSnapshot.bulkWrite(bulkOps);

}

export const assignOverallRankService = async () => {
    const result = await UserRanking.aggregate([
        {
          $setWindowFields: {
            sortBy: { total: 1 },
            output: {
              rank: { $rank: {} }
            }
          }
        },
        {
          $project: {
            username: 1,
            total: 1,
            rank: 1
          }
        }
      ]);
    
    
  // Step 2: Update each user's snapshot with their overallRank
  const bulkOps = result.map((user) => ({
    updateOne: {
      filter: { username: user.username },
      update: { $set: { overallRank: user.rank } },
      upsert: true
    }
  }));
 await UserRankSnapshot.bulkWrite(bulkOps);
}