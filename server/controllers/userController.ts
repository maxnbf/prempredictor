import { LiveTable } from "../models/liveTableModel";
import * as rankingService from "../services/rankingService";

export async function makeRanking(request, response) {
    const activeUser = request?.body?.user?.username;

    const { teams, favorite } = request.body;
    try {
        const ranking = await rankingService.makeRanking(activeUser, teams, favorite);
        return response.status(201).json(ranking);
    }
    catch (e) {
        response.status(500).json({error: e})
    }
}

export async function getRanking(request, response) {
    try {
        const ranking = await rankingService.getRanking(request.params.username);
        return response.status(201).json(ranking);
    }
    catch (e) {
        response.status(500).json({error: e})
    }
}

export async function getLive(request, response) {

    try {
        const liveTable = await LiveTable.findOne();
        return response.status(201).json(liveTable);
    }
    catch (e) {
        response.status(500).json({error: e})
    }
}

export async function getAllRankings(request, response) {
    try {
        const allRankings = await rankingService.getAll() 
        return response.status(201).json(allRankings);
    }
    catch (e) {
        response.status(500).json({error: e})
    }

}
