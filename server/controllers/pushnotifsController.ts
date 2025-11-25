import { User } from "../models/userModel";

export async function saveToken(request) {
    console.log("hello")
    const userId = request?.body?.user?.userId;
    const { token } = request.body;
    
    await User.updateOne(
        { _id: userId },
        { $set: { expoPushToken: token } }
    );
    
    return { success: true };
}

