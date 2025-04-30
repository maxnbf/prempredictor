import axios from 'axios';
import { Notification } from '../types/types';

export interface NotificationsResponse {
  notifs: Notification[];
  newNotifs: number;
}

export const getNotifs = async (): Promise<NotificationsResponse> => {
  const response = await axios.get(`http://10.0.0.169:80/api/notifs/get-notifs`);
  return response.data as NotificationsResponse;
};
