import axios from 'axios';
import { API_URL } from './util';

export interface RegisterNotificationsResponse {
    success: boolean;
}

export const registerNotifs = async (token: string ): Promise<RegisterNotificationsResponse> => {
  const response = await axios.post(`${API_URL}/api/pushnotifs/save-token`, { token });
  return response.data as RegisterNotificationsResponse;
};
