import mongoose, { Document, Schema } from "mongoose";

export interface UserPointsDocument extends Document {
    username: string;
    points: number;
}

const UserPointsSchema = new Schema<UserPointsDocument>({
    username: {
        type: String,
        required: true,
    },
    points: {
        type: Number,
        required: true,
    }
}, { autoCreate: true });

export const UserPoints = mongoose.model<UserPointsDocument>(
    "UserPoints",
    UserPointsSchema
);
