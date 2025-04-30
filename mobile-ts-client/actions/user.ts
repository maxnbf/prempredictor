import axios from 'axios';
import { Profile } from '../types/types';

export interface SetFavoriteResponse {
  success: boolean;
}

export const setFavorite = async (favorite: string): Promise<SetFavoriteResponse> => {
  const response = await axios.post<SetFavoriteResponse>(
    'http://10.0.0.1698080api/user/setFavorite',
    { favorite }
  );
  return response.data;
};

export const getFavorite = async (): Promise<string> => {
  const response = await axios.get<string>('http://10.0.0.1698080api/user/getFavorite');
  return response.data;
};

export interface GetUserMetadataResponse {
  username: string;
  favoriteTeam: string;
  bio?: string;
}

export const getUserMetadata = async (): Promise<GetUserMetadataResponse> => {
  const response = await axios.get<GetUserMetadataResponse>(
    'http://10.0.0.1698080api/user/getUserMetadata'
  );
  return response.data;
};

export const searchUsers = async (query: string): Promise<string[]> => {
  const response = await axios.get<string[]>(`http://10.0.0.1698080api/user/${query}/search`);
  return response.data;
};

export const getProfile = async (): Promise<Profile> => {
  const response = await axios.get('http://10.0.0.1698080api/user/getProfile');
  return response.data
}

export const deleteAccount = async (): Promise<boolean> => {
  const response = await axios.get('http://10.0.0.1698080api/user/deleteAccount');
  return response.data;
}