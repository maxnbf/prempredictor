import { Document } from "mongodb";
import mongoose, { Schema } from "mongoose";

export interface NotifDocument extends Document {
    from: string;
    to: string;
    notifType: string;
    seen: boolean;
} 
const NotifSchema: Schema<NotifDocument> = new mongoose.Schema({
    from: {
        type: String,
        required: true
    }, 
    to: {
        type: String,
        required: true
    }, 
    notifType: {
        type: String,
        enum: ["sentRequest", "acceptedRequest"],
        required: true
    }, 
    seen: {
        type: Boolean,
        required: true
    },
    metadata: {
        type: String,
        require: false
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 3600*24*30, // TTL in seconds (30 days)
    },
}, { autoCreate: true})

export const Notif = mongoose.model("Notif", NotifSchema);