import * as pushnotifService from "../services/pushNotificationService"

export async function saveToken(request) {
    const userId = request?.body?.user?.userId;
    const { token } = request.body;

    console.log("Saving token for ", userId, + " at ", new Date().toISOString())
    
    return await pushnotifService.saveToken(token, userId)
}

