import { User } from "../models/userModel";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { UserMetadata } from "../models/userMetadataModel";

const secretKey = process.env.SECRET_KEY;

function createJwt(userId: string, username: string): string {
  console.log("creating token: ", userId, username)
  const token = jwt.sign({ userId, username }, secretKey);
  return token;
}

export const signup = async (req, res) => {
    const { username, password, name } = req.body;
    try {
        const existingUser = await User.findOne({ username });
    
        if (existingUser) {
          return res.status(400).json({ message: "Username already exists" });
        }
    
        const newUser = new User({ username, password, name });
        await newUser.save();
    
        const token = createJwt(newUser._id.toString(), username);

        console.log(token)
    
        res.status(201).json({
          message: "User created successfully",
          token,
          userId: newUser._id,
          username,
          name,
        });
      } catch (e) {
        res.status(500).json({ message: "Internal server error" });
      }
  }
  
export const signin = async (req, res) => {
  const { username, password } = req.body;

    try {
      const user = await User.findOne({ username });
      if (!user) {
        return res.status(401).json({ message: "Invalid username or password" });
      }
  
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        return res.status(401).json({ message: "Invalid username or password" });
      }
  
      // Create JWT token
      const token = createJwt(user._id.toString(), username);
      res.json({
        message: "User signed in successfully",
        token,
        userId: user._id,
        username,
        name: user.name,
      });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
}