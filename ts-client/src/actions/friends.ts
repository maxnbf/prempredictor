import axios from 'axios';
import { Friend, FriendRequest, FriendStatus } from '../types/types';

export const sendFriendRequest = async (to: string) => {
  const response = await axios.post(`http://10.0.0.1698080api/friends/${to}/send-request`);
  return response.data;
};

export const unfriendUser = async (to: string) => {
  const response = await axios.post(`http://10.0.0.1698080api/friends/${to}/unfriend-user`);
  return response.data;
};

export const acceptFriendRequest = async (from: string) => {
  const response = await axios.post(`http://10.0.0.1698080api/friends/${from}/accept-request`);
  return response.data;
};

export const rejectFriendRequest = async (from: string) => {
  const response = await axios.post(`http://10.0.0.1698080api/friends/${from}/reject-request`);
  return response.data;
};

export const getFriends = async (username: string): Promise<Friend[]> => {
  const response = await axios.get(`http://10.0.0.1698080api/friends/${username}/get-friends`);
  return response.data as Friend[];
};

export const getFriendStatus = async (to: string): Promise<FriendStatus> => {
  const response = await axios.get(`http://10.0.0.1698080api/friends/${to}/get-friend-status`);
  return response.data as FriendStatus;
};

export const getAllFriendRequests = async (): Promise<FriendRequest[]> => {
  const response = await axios.get(`http://10.0.0.1698080api/friends/get-all-requests`);
  return response.data as FriendRequest[];
};
