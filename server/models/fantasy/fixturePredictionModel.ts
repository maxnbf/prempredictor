import mongoose, { Document, Schema } from "mongoose";

export interface FixturePredictionDocument extends Document {
    fixture: mongoose.Types.ObjectId;
    username: string; 
    homeScore: number;         
    awayScore: number;
}

const FixturePredictionSchema = new Schema<FixturePredictionDocument>({
    fixture: {
        type: Schema.Types.ObjectId,
        ref: "Fixture",
        required: true
    },
    username: {
        type: String,
        required: true
    },
    homeScore: {
        type: Number,
        required: true
    },
    awayScore: {
        type: Number,
        required: true
    }
});

export const FixturePrediction = mongoose.model(
    "FixturePrediction",
    FixturePredictionSchema
);