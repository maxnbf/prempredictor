import mongoose, { Schema, Document } from "mongoose";

export interface UserRankingDocument extends Document {
  username: string;
  ranking: [string];
  points: [number];
  total: number;
  favorite: string;
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
        points: {
            type: [Number],
            required: true,
        },
        total: {
            type: Number,
            required: true,
        },
        favorite: {
            type: String,
            required: true,
        }
    },
    { autoCreate: true }
)


export const UserRanking = mongoose.model("UserRanking", userRankingSchema);
