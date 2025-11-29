import mongoose, { Document, Schema } from "mongoose";

export interface FixtureDocument extends Document {
    homeTeam: string;
    awayTeam: string;
    dateTime: string;
    week: number;
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
    week: {
        type: Number, 
        required: true
    }
}, { autoCreate: true})

export const Fixture = mongoose.model('Fixture', FixtureSchema);
