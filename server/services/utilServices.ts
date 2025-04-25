import { TeamLogos } from "../models/teamLogosModel";

export async function getTeamLogosService() {
    const response = await TeamLogos.findOne().lean();
    return response.logos;
}