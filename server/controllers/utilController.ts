import { getTeamLogosService } from '../services/utilServices';

export function withHandler(handler) {
  return async function (request, response) {
    try {
      const data = await handler(request);
      return response.status(201).json(data);
    } catch (error) {
      console.error('Handler error:', error);
      return response.status(500).json({ error: error.message || 'Internal Server Error' });
    }
  };
}

export const getTeamLogos = async () => {
  console.log("getting logos", new Date())
  return await getTeamLogosService();
}