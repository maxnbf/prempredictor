import * as notifService from "../services/notifService"

export async function getNotifs(request) {
    const { username } = request?.body?.user;
    return await notifService.getNotifs(username)
}