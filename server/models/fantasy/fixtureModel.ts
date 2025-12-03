import mongoose, { Document, Schema } from "mongoose";

export interface FixtureDocument extends Document {
    homeTeam: string;
    awayTeam: string;
    dateTime: string;
    homeScore: number;
    awayScore: number;
    week: number;
    notified: boolean;
}

const FixtureSchema: Schema<FixtureDocument> = new mongoose.Schema({
    homeTeam: {
        type: String,
        required: true
    }, 
    awayTeam: {
        type: String,
        required: true
    }, 
    dateTime: {
        type: String,
        required: true
    },
    homeScore: {
        type: Number, 
        required: false
    },
    awayScore: {
        type: Number, 
        required: false
    },
    week: {
        type: Number, 
        required: true
    }, 
    notified: {
        type: Boolean,
        required: false
    }
}, { autoCreate: true})

export const Fixture = mongoose.model('Fixture', FixtureSchema);
