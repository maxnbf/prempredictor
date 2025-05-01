import axios from 'axios';
import { LiveRanking, RankingSnapshot, TimeSeriesPoints, UserRanking, UserScore } from '../types/types';
import { API_URL } from './util';

export const makeRanking = async (data: any) => {
  const response = await axios.post(`${API_URL}/api/myTable/ranking`, data)
  console.log("made ranking", response.data)
  return response.data;
};

export const getRankingSnapshot = async (): Promise<RankingSnapshot> => {
  const response = await axios.get(`${API_URL}/api/myTable/get-ranking-snapshot`)
  return response.data as RankingSnapshot
}

export const getRanking = async (user: string): Promise<UserRanking> => {
  const response = await axios.get(`${API_URL}/api/myTable/${user}/ranking`)
  return response.data as UserRanking;
};

export const getLiveRanking = async (): Promise<LiveRanking> => {
  const response = await axios.get(`${API_URL}/api/myTable/live`)
  return response.data as LiveRanking;
};

export const getAllRanking = async (): Promise<UserScore[]> => {
  const response = await axios.get(`${API_URL}/api/myTable/leaderboard`)
  return response.data as UserScore[];
};

export const getFanRanking = async (favorite: string): Promise<UserScore[]> => {
  const response = await axios.get(`${API_URL}/api/myTable/${favorite}/rankingByFavorite`)
  return response.data as UserScore[];
};

export const getTimeSeriesPoints = async (user: string): Promise<TimeSeriesPoints[]> => {
  const response = await axios.get(`${API_URL}/api/myTable/${user}/getTimeSeriesPoints`)
  return response.data as TimeSeriesPoints[];
};

export const getLiveRankingForGameWeek = async (gameWeek: string): Promise<LiveRanking> => {
   const response = await axios.get(`${API_URL}/api/myTable/${gameWeek}/liveRanking`)
   return response.data as LiveRanking;
};

export const getAllFriendsRankings = async (): Promise<UserScore[]> => {
  const response = await axios.get(`${API_URL}/api/myTable/all-friends-rankings`);
  return response.data as UserScore[];
};