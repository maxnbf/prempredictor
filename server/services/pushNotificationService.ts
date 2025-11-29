import { Expo } from 'expo-server-sdk';
import { User } from '../models/userModel';

const expo = new Expo();

export async function saveToken(token, userId, username) {
    // Try finding by userId first
    let user = await User.findById(userId);

    // If not found, try finding by username
    if (!user) {
        console.log("No user find with id " + userId)
        user = await User.findOne({ username });
    }

    // If still not found, return failure
    if (!user) {
        console.log("No user find with id " + username)
        return { success: false, error: "User not found" };
    }

    // Update the found user
    await User.updateOne(
        { _id: user._id },
        { $set: { expoPushToken: token } }
    );

    return { success: true };
}

export async function sendPushNotificationsToAllUsers(gameWeek) {
    try {
        // Get all users with expoPushToken populated
        const users = await User.find({ 
            $and: [
                { expoPushToken: { $exists: true } },
                { expoPushToken: { $ne: null } },
                { expoPushToken: { $ne: '' } }
            ]
        }).select('expoPushToken');

        if (users.length === 0) {
            console.log('No users with push tokens found');
            return;
        }

        // Create messages for all valid tokens
        const messages = [];
        for (const user of users) {
            if (!Expo.isExpoPushToken(user.expoPushToken)) {
                console.error(`Invalid Expo push token for user: ${user._id}`);
                continue;
            }

            messages.push({
                to: user.expoPushToken,
                sound: 'default',
                title: `Gameweek ${gameWeek} is complete.`,
                body: `Come check out your new score!`,
                data: { timestamp: new Date().toISOString() },
            });
        }

        if (messages.length === 0) {
            console.log('No valid push tokens to send notifications to');
            return;
        }

        // Send notifications in chunks (Expo allows up to 100 messages per request)
        const chunks = expo.chunkPushNotifications(messages);
        const tickets = [];

        for (const chunk of chunks) {
            try {
                const ticketChunk = await expo.sendPushNotificationsAsync(chunk);
                tickets.push(...ticketChunk);
            } catch (error) {
                console.error('Error sending push notification chunk:', error);
            }
        }

        console.log(`Sent ${messages.length} push notifications to users`);
        return tickets;
    } catch (error) {
        console.error('Error in sendPushNotificationsToAllUsers:', error);
        throw error;
    }
}

export async function sendPushNotificationToUser(username, title, body, data = {}) {
  try {
    // 1. Find user by username
    const user = await User.findOne({ username }).select("expoPushToken");
    
    if (!user) {
      console.error(`User not found: ${username}`);
      return { success: false, error: "User not found" };
    }

    // 2. Check if user has a valid token
    const token = user.expoPushToken;

    if (!token || typeof token !== "string" || token.trim() === "") {
      console.error(`User ${username} has no push token`);
      return { success: false, error: "User has no push token" };
    }

    if (!Expo.isExpoPushToken(token)) {
      console.error(`Invalid Expo token for user ${username}: ${token}`);
      return { success: false, error: "Invalid Expo push token" };
    }

    // 3. Create the message
    const message = {
      to: token,
      sound: "default",
      title,
      body,
      data: {
        ...data,
        timestamp: new Date().toISOString(),
      },
    };

    // 4. Send the message (Expo requires chunking even for 1 token)
    const chunks = expo.chunkPushNotifications([message]);
    const tickets = [];

    for (const chunk of chunks) {
      try {
        const ticketChunk = await expo.sendPushNotificationsAsync(chunk);
        tickets.push(...ticketChunk);
      } catch (error) {
        console.error("Error sending push notification chunk:", error);
        return { success: false, error };
      }
    }

    console.log(`Sent push notification to ${username}`);
    return { success: true, tickets };

  } catch (error) {
    console.error("Error in sendPushNotificationToUser:", error);
    return { success: false, error };
  }
}