import * as pushnotifService from "../services/pushNotificationService"

export async function saveToken(request) {
    const userId = request?.body?.user?.userId;
    const { token } = request.body;
    
    return await pushnotifService.saveToken(token, userId)
}

