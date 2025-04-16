import mongoose, { Document, Schema } from "mongoose";

export interface FriendsDocument extends Document {
    from: string;
    to: string;
}

const FriendsSchema: Schema<FriendsDocument> = new mongoose.Schema({
    from: {
        type: String,
        required: true
    }, 
    to: {
        type: String,
        required: true
    }
}, { autoCreate: true})

export const Friends = mongoose.model('Friends', FriendsSchema);
