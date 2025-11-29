import * as pushnotifService from "../services/pushNotificationService"

export async function saveToken(request) {
    const { userId, username } = request?.body?.user;
    const { token } = request.body;

    console.log("Saving token for " + userId + " at " + new Date().toISOString())
    
    return await pushnotifService.saveToken(token, userId, username)
}

export async function failedNotif(request) {
    const userId = request?.body?.user?.userId;
    const { message } = request.body;

    console.log("Failed saving token for " + userId + " at " + new Date().toISOString() + " with message: " + message)
    
    return { success: true }
}


