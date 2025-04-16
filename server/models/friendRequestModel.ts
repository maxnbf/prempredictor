import mongoose, { Document, Schema } from "mongoose";

export interface FriendRequestDocument extends Document {
    from: string;
    to: string;
    state: string;
    createdAt: Date;
}

const FrendRequestSchema: Schema<FriendRequestDocument> = new mongoose.Schema({
    from: { type: String, required: true},
    to: { type: String, required: true},
    state: { type: String, enum: ["request", "accepted", "rejected"], required: true },
    createdAt: {
        type: Date,
        default: Date.now,
    },
})

export const FriendRequest = mongoose.model("FriendRequest", FrendRequestSchema);