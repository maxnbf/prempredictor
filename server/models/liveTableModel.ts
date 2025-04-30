import mongoose, { Schema, Document } from "mongoose";

export interface LiveTableDocument extends Document {
    ranking: [string];
    lastUpdated: number;
    season: string;
    currentRound: number;
    isWeekComplete: number
}

const liveTableDocument: Schema<LiveTableDocument> = new mongoose.Schema(
    {
        ranking: {
            type: [String],
            required: true
        },
        lastUpdated: {
            type: Number,
            required: true
        },
        season: {
            type: String,
            require: true
        },
        currentRound: {
            type: Number,
            require: true
        },
        isWeekComplete: {
            type: Number,
            require: true
        }
    },
    { autoCreate: true }
)


export const LiveTable = mongoose.model("LiveTable", liveTableDocument);
