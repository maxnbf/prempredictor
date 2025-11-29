import * as fantasyService from "../services/fantasyService";

export async function getFixtures(request) {
    const username = request.body.user.username;
    const { gameweek } = request?.params;
    return await fantasyService.getFixtures(gameweek, username)
}

export async function submitPredictions(request) {
    const username = request?.body?.user.username;
    const { predictions } = request?.body;

    return await fantasyService.submitPredictions(username, predictions)
}

export async function getFantasyRanking(request) {
    const username = request?.body?.user.username;
    const { gameweek } = request?.params;

    return await fantasyService.getFantasyRanking(username, gameweek)
}

export async function submitFantasyRanking(request) {
    const username = request?.body?.user?.username;
    const { teams, pointsUsed, gameweek } = request.body;

    return await fantasyService.submitFantasyRanking(username, teams, pointsUsed, gameweek)
}

export async function getUserPoints(request) {
    const username = request?.body?.user.username;
    console.log("in controller", username)
    return await fantasyService.getUserPoints(username);
}