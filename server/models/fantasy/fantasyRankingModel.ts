import mongoose, { Document, Schema } from "mongoose";

export interface FantasyRanking extends Document {
    username: string;
    ranking: [string];
    week: number;
}

const FantasyRankingSchema: Schema<FantasyRanking> = new mongoose.Schema({
    username: {
        type: String,
        required: true
    }, 
    ranking: {
        type: [String],
        required: true
    }, 
    week: {
        type: Number,
        required: true
    }
}, { autoCreate: true})

export const FantasyRanking = mongoose.model('FantasyRanking', FantasyRankingSchema);
