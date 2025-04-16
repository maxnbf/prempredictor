import "dotenv/config";
import mongoose from "mongoose";

const mongoURI = process.env.MONGO

export const connectDb = async () => {
  try {
    await mongoose.connect(mongoURI);
  } catch (err) {
    console.error("Error connecting to MongoDB:", err.message);
    process.exit(1); // Exit process with failure
  }
};
