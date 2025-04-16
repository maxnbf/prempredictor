import mongoose, { Schema, Document, mongo } from "mongoose";
import bcrypt from "bcrypt";

export interface UserMetadataDocument extends Document {
    username: string;
    favoriteTeam: string;
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
            required: true,
        },
        bio: {
            type: String,
            required: false
        }
    }
);

export const UserMetadata = mongoose.model("UserMetadata", userMetadataSchema)