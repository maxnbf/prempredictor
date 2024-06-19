import "dotenv/config";
import mongoose from "mongoose";

const mongoURI = 'mongodb+srv://maxnbf:SItb1126@cluster0.o2zvb.mongodb.net/premdatabase?retryWrites=true&w=majority';

export const connectDb = async () => {
  try {
    await mongoose.connect(mongoURI);
  } catch (err) {
    console.error("Error connecting to MongoDB:", err.message);
    process.exit(1); // Exit process with failure
  }
};
