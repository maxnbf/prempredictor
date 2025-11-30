import axios from "axios";
import { API_URL } from "./util";
import { Fixture, Prediction, PredictionInput } from "../types/types";

export interface GetFixturesResponse { 
    fixtures: Fixture[]
    predictions: Prediction[]
}
export const getFixtures = async (gameweek: number): Promise<GetFixturesResponse> => {
  const response = await axios.get(`${API_URL}/api/fantasy/${gameweek}/getFixtures`);
  return response.data;
};

export const submitPredictions = async (predictions: PredictionInput[]): Promise<Prediction[]> => {
  const response = await axios.post(`${API_URL}/api/fantasy/submitPredictions`, { predictions });
  return response.data;
};


export const getFantasyRanking = async (gameweek: number) => {
  const response = await axios.get(`${API_URL}/api/fantasy/${gameweek}/getFantasyRanking`);
  return response.data;
};

export interface SubmitFantasyRankingResponse {
  ranking: string[]
  userPoints: number;
}

export const submitFantasyRanking = async (
  teams: string[],
  pointsUsed: number,
  gameweek: number
): Promise<SubmitFantasyRankingResponse> => {
  const response = await axios.post(`${API_URL}/api/fantasy/${gameweek}/submitFantasyRanking`, {
    teams,
    pointsUsed,
    gameweek
  });
  return response.data;
};

export const getUserPoints = async () => {
  const response = await axios.get(`${API_URL}/api/fantasy/userPoints`);
  return response.data;
};