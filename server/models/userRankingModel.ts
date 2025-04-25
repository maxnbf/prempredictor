import mongoose, { Schema, Document } from "mongoose";

export interface UserRankingDocument extends Document {
  username: string;
  ranking: [string];
  total: number;
    favorite: string;
    weekStarted?: number;
}

const userRankingSchema: Schema<UserRankingDocument> = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true
        },
        ranking: {
            type: [String],
            required: true,
        },
        total: {
            type: Number,
            required: true,
        },
        favorite: {
            type: String,
            required: false,
        },
        weekStarted: {
            type: Number,
            required: false,
        }
    },
    { autoCreate: true }
)


export const UserRanking = mongoose.model("UserRanking", userRankingSchema);
