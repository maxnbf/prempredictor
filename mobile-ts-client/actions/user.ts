import axios from 'axios';
import { Profile } from '../types/types';
import { API_URL } from './util';

export interface SetFavoriteResponse {
  success: boolean;
}

export const setFavorite = async (favorite: string): Promise<SetFavoriteResponse> => {
  const response = await axios.post<SetFavoriteResponse>(
    `${API_URL}/api/user/setFavorite`,
    { favorite }
  );
  return response.data;
};

export const getFavorite = async (): Promise<string> => {
  const response = await axios.get<string>(`${API_URL}/api/user/getFavorite`);
  return response.data;
};

export interface GetUserMetadataResponse {
  username: string;
  favoriteTeam: string;
  bio?: string;
}

export const getUserMetadata = async (): Promise<GetUserMetadataResponse> => {
  const response = await axios.get<GetUserMetadataResponse>(
    `${API_URL}/api/user/getUserMetadata`
  );
  return response.data;
};

export const searchUsers = async (query: string): Promise<string[]> => {
  const response = await axios.get<string[]>(`${API_URL}/api/user/${query}/search`);
  return response.data;
};

export const getProfile = async (): Promise<Profile> => {
  console.log("WHAAT")
  const response = await axios.get(`${API_URL}/api/user/getProfile`);
  console.log("HELLO")
  return response.data
}

export const deleteAccount = async (): Promise<boolean> => {
  const response = await axios.get(`${API_URL}/api/user/deleteAccount`);
  return response.data;
}