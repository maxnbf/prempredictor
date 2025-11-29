import * as pushnotifService from "../services/pushNotificationService"

export async function saveToken(request) {
    const userId = request?.body?.user?.userId;
    const { token } = request.body;

    console.log("Saving token for " + userId + " at " + new Date().toISOString())
    
    return await pushnotifService.saveToken(token, userId)
}

export async function failedNotif(request) {
    const userId = request?.body?.user?.userId;
    const { message } = request.body;

    console.log("Failed saving token for " + userId + " at " + new Date().toISOString() + " with message: " + message)
    
    return { success: true }
}


