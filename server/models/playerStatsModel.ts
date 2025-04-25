import mongoose, { Schema, Document } from "mongoose";

export interface PlayerStatsDocument extends Document {
    averagePoints: number;
    lowestPoints: {
        username: string;
        points: number;
    };
}

const playerStatsSchema: Schema<PlayerStatsDocument> = new mongoose.Schema({
    averagePoints: {
        type: Number,
        required: true,
    },
    lowestPoints: {
        username: {
            type: String,
            required: true,
        },
        points: {
            type: Number,
            required: true,
        },
    },
});

export const PlayerStats = mongoose.model("PlayerStats", playerStatsSchema);
