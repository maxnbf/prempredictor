export interface UserRanking {
  favorite: string;
  points: number[];
  ranking: string[];
  total: number;
  username: string;
}

export interface LiveRanking {
  ranking: string[];
  season: string;
  currentRound: number;
  lastUpdated: number;
  isWeekComplete: boolean;
}

export interface TimeSeriesPoints {
  currentRound: number;
  score: number;
}

export interface Notification {
  from: string;
  to: string;
  metadata: string;
  createdAt: Date;
  notifType: string;
  seen: boolean;
}

export enum FriendRequestType {
  REQUEST = 'request',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected',
}

export interface FriendRequest {
  from: string;
  to: string;
  state: FriendRequestType;
  createdAt: Date;
}

export interface UserMetadata {
  username: string;
  favoriteTeam: string;
  fullName: string
}

export interface Friend {
  user: UserMetadata;
  isFriend: boolean;
}

export interface FriendStatus {
  isFriends: boolean;
  request: FriendRequest;
}

export interface RankingSnapshot {
  favoriteTeamRank?: number;
  overallRank?: number;
  friendsRank?: number;
  username: string
  averagePoints: number
  lowestPoints: {
    username: string;
    points: number;
  };
  myPoints: number;
  currentGameWeek: number;
}

export interface UserScore {
  username: string;
  score: number;
  favorite: string
}

export interface Profile {
  username: string;
  favoriteTeam: string;
  total: number;
  joined: Date;
  friendCount: number;
  fullName: string;
}

export interface Fixture {
  _id: string;
  homeTeam: string;
  awayTeam: string;
  dateTime: string;
  week: number;
}

export interface Prediction {
  fixture: Fixture;
  homeScore: number;
  awayScore: number;
}

export interface PredictionInput {
  fixture: string;
  homeScore: number;
  awayScore: number;
}