import axios, { AxiosResponse } from 'axios';
import { LiveRanking, TimeSeriesPoints, UserRanking } from '../types/types';
import { UserScore } from '../components/all/All';

// TODO: rewrite as user.ts
export const makeRanking = (data: any): Promise<AxiosResponse> => {
  return new Promise((resolve, reject) => {
    axios
      .post('http://10.0.0.169:9000/api/myTable/ranking', data)
      .then((res: AxiosResponse) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
        console.log('ERROR', err);
      });
  });
};

export const getRanking = (user: string): Promise<UserRanking> => {
  return new Promise((resolve, reject) => {
    axios
      .get(`http://10.0.0.169:9000/api/myTable/${user}/ranking`)
      .then((res: AxiosResponse) => {
        resolve(res.data as UserRanking);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const getLiveRanking = (): Promise<LiveRanking> => {
  return new Promise((resolve, reject) => {
    axios
      .get('http://10.0.0.169:9000/api/myTable/live')
      .then((res: AxiosResponse) => {
        // Type assertion to ensure res.data.ranking is a string[]
        const ranking = res.data as LiveRanking;
        resolve(ranking);
      })
      .catch((err) => {
        reject(err);
        console.log('ERROR', err);
      });
  });
};

export const getAllRanking = (): Promise<AxiosResponse> => {
  return new Promise((resolve, reject) => {
    axios
      .get('http://10.0.0.169:9000/api/myTable/leaderboard')
      .then((res: AxiosResponse) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
        console.log('ERROR', err);
      });
  });
};

export const getFanRanking = (favorite: string): Promise<AxiosResponse> => {
  return new Promise((resolve, reject) => {
    axios
      .get(`http://10.0.0.169:9000/api/myTable/${favorite}/rankingByFavorite`)
      .then((res: AxiosResponse) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
        console.log('ERROR', err);
      });
  });
};

export const getTimeSeriesPoints = (user: string): Promise<TimeSeriesPoints[]> => {
  return new Promise((resolve, reject) => {
    axios
      .get(`http://10.0.0.169:9000/api/myTable/${user}/getTimeSeriesPoints`)
      .then((res: AxiosResponse) => {
        const points = res.data as TimeSeriesPoints[];
        resolve(points);
      })
      .catch((err) => {
        reject(err);
        console.log('ERROR', err);
      });
  });
};

export const getLiveRankingForGameWeek = (gameWeek: string): Promise<LiveRanking> => {
  return new Promise((resolve, reject) => {
    axios
      .get(`http://10.0.0.169:9000/api/myTable/${gameWeek}/liveRanking`)
      .then((res: AxiosResponse) => {
        resolve(res.data as LiveRanking);
      })
      .catch((err) => {
        reject(err);
        console.log('ERROR', err);
      });
  });
};

export const getAllFriendsRankings = async (): Promise<UserScore[]> => {
  const response = await axios.get(`http://10.0.0.169:9000/api/myTable/all-friends-rankings`);
  return response.data as UserScore[];
};

// TODO implement on backend, (i.e average guess)
// export const getCommunityRanking = (): Promise<AxiosResponse> => {
//   return new Promise((resolve, reject) => {
//     axios
//       .get("http://10.0.0.169:9000/api/ranking/community_ranking")
//       .then((res: AxiosResponse) => {
//         resolve(res);
//       })
//       .catch((err) => {
//         reject(err);
//         console.log("ERROR", err);
//       });
//   });
// };
