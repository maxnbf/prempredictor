import mongoose, { Document, Schema } from "mongoose";

export interface TeamLogosDocument extends Document {
  logos: Map<string, string>; 
}

const TeamLogosSchema: Schema<TeamLogosDocument> = new mongoose.Schema(
  {
    logos: {
      type: Map,
      of: String,
      required: true
    }
  },
  { autoCreate: true }
);

export const TeamLogos = mongoose.model<TeamLogosDocument>(
  "TeamLogos",
  TeamLogosSchema
);
