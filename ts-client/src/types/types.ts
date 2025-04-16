export interface UserRanking {
    favorite: string
    points: number[]
    ranking: string[]
    total: number
    username: string
}

export interface LiveRanking {
    ranking: string[]
    logoUrls: string[]
    season: string
    currentRound: number
    lastUpdated: number
}

export interface TimeSeriesPoints {
    currentRound: number
    score: number
}

export interface Notification { 
    from: string
    to: string
    metadata: string
    createdAt: Date
    notifType: string
    seen: boolean
}

export enum FriendRequestType {
    REQUEST = 'request',
    ACCEPTED = 'accepted',
    REJECTED = 'rejected'
}

export interface FriendRequest {
    from: string
    to: string
    state: FriendRequestType
    createdAt: Date
}

export interface UserMetadata {
    username: string,
    favoriteTeam: string
}

export interface Friend {
    user: UserMetadata
    isFriend: boolean
}

export interface FriendStatus {
    isFriends: boolean
    request: FriendRequest
}