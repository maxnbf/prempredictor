import axios from 'axios';
import { Notification } from '../types/types';
import { API_URL } from './util';

export interface NotificationsResponse {
  notifs: Notification[];
  newNotifs: number;
}

export const getNotifs = async (): Promise<NotificationsResponse> => {
  const response = await axios.get(`${API_URL}/api/notifs/get-notifs`);
  return response.data as NotificationsResponse;
};
