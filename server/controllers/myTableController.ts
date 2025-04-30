import { LiveTable } from "../models/liveTableModel";
import { assignFavoriteTeamRankService, assignFriendRankService, assignOverallRankService, assignTopLevelStatsService, getRankingSnapshotService } from "../services/rankSnapshotService";
import { getAllFriendRankingsService, getAllService, getLiveRankingForGameWeekService, getRankingService, getTimeSeriesPointsService, getUsersByFavoriteService, makeRankingService } from "../services/rankingService"
import { setFavoriteService } from "../services/userService";

export async function makeRanking(request) {
    const activeUser = request?.body?.user?.username;
    const { teams, favoriteTeam } = request.body;
    const ranking = await makeRankingService(activeUser, teams);
    await setFavoriteService(activeUser, favoriteTeam);
    
    await assignFavoriteTeamRankService();
    await assignOverallRankService();
    await assignFriendRankService();
    await assignTopLevelStatsService();

    return ranking;
}

export async function getRankingsByFavorite(request) {
    return await getUsersByFavoriteService(request.params.favorite);
}

export async function getRanking(request) {
    return await getRankingService(request.params.username);
}

export async function getLive(request) {
    return await LiveTable.findOne().sort({ currentRound: -1 });
}

export async function getAllRankings(request) {
   return await getAllService() 
}

export async function getLiveRankingForGameWeek(request) {
    const { gameWeek } = request.params
    return await getLiveRankingForGameWeekService(gameWeek)
}

export async function getTimeSeriesPoints(request, response) {
    const { username } = request.params
    return await getTimeSeriesPointsService(username);
}

export async function getAllFriendRankings(request) {
    const activeUser = request?.body?.user?.username;
    return await getAllFriendRankingsService(activeUser);
}

export async function getRankingSnapshot(request) {
    const activeUser = request?.body?.user?.username;
    return await getRankingSnapshotService(activeUser)
}