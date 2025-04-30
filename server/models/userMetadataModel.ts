import mongoose, { Schema, Document, Date } from "mongoose";

export interface UserMetadataDocument extends Document {
    username: string;
    favoriteTeam: string;
    dateJoined: Date;
    fullName: string;
    bio?: string;
}

const userMetadataSchema: Schema<UserMetadataDocument> = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
        },
        favoriteTeam: {
            type: String,
            required: false,
        },
        bio: {
            type: String,
            required: false
        }, 
        dateJoined: {
            type: Date,
            required: true
        }, 
        fullName: {
            type: String,
            required: true
        }
    }
);

export const UserMetadata = mongoose.model("UserMetadata", userMetadataSchema)