import mongoose, { Schema, Document } from "mongoose";

export interface LiveTableDocument extends Document {
  ranking: [string];
}

const liveTableDocument: Schema<LiveTableDocument> = new mongoose.Schema(
    {
        ranking: {
            type: [String],
            required: true
        }
    },
    { autoCreate: true }
)


export const LiveTable = mongoose.model("LiveTable", liveTableDocument);
