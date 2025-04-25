import mongoose, { Schema, Document, mongo } from "mongoose";

export interface UserRankSnapshotDocument extends Document {
    overallRank?: number
    favoriteTeamRank?: number
    friendsRank?: number
    startWeekRank?: number
    username: string
}

const userRankSnapshotSchema: Schema<UserRankSnapshotDocument> = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
        },
        overallRank: {
            type: Number,
            required: false,
        },
        favoriteTeamRank: {
            type: Number,
            required: false,
        },
        friendsRank: {   
            type: Number,
            required: false,
        },
        startWeekRank: {
            type: Number,
            required: false,
        }
    }
);

export const UserRankSnapshot = mongoose.model("UserRankSnapshot", userRankSnapshotSchema)