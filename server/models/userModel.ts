import mongoose, { Schema, Document } from "mongoose";
import bcrypt from "bcrypt";

export interface UserDocument extends Document {
  name: string;
  username: string;
  password: string;
}

const userSchema: Schema<UserDocument> = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    }
  },
  { autoCreate: true }
);

userSchema.pre<UserDocument>("save", async function (next) {
    const user = this;
    if (!user.isModified("password")) return next();

    try {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(user.password, salt);
      user.password = hashedPassword;
      next();
    } catch (error) {
      return next(error);
    }
});

export const User = mongoose.model("User", userSchema);
