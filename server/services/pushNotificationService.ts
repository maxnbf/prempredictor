import { Expo } from 'expo-server-sdk';
import { User } from '../models/userModel';

const expo = new Expo();

export async function saveToken(token, userId) {
    await User.updateOne(
        { _id: userId },
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

