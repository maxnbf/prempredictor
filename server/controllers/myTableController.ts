import { LiveTable } from "../models/liveTableModel";
import { getRankingSnapshotService } from "../services/rankSnapshotService";
import { getAllFriendRankingsService, getAllService, getLiveRankingForGameWeekService, getRankingService, getTimeSeriesPointsService, getUsersByFavoriteService, makeRankingService } from "../services/rankingService"

export async function makeRanking(request) {
    const activeUser = request?.body?.user?.username;
    const { teams } = request.body;
    return await makeRankingService(activeUser, teams);
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