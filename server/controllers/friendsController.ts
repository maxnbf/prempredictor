import * as friendService from "../services/friendsService";

export async function sendRequest(request) {
    const from = request?.body?.user?.username;
    const { to }  = request?.params;
    await friendService.sendRequest(from, to);
    return true;
}

export async function acceptRequest(request) {
    const to = request?.body?.user?.username;
    const { from }  = request?.params;
    await friendService.acceptRequest(from, to)
    return true;
}

export async function getFriends(request) {
    const activeUser = request?.body?.user?.username;
    const { username } = request?.params;
    return await friendService.getFriends(username, activeUser);
}

export async function rejectRequest(request) {
    const { from } = request?.params;
    const to = request?.body?.user?.username;
    await friendService.rejectRequest(from, to)
    return true;
}

export async function getAllFriendRequest(request) {
    const activeUser = request?.body?.user?.username;
    return await friendService.getAllFriendRequestService(activeUser)
}

export async function unfriendUser(request) {
    const activeUser = request?.body?.user?.username;
    const { to } = request?.params
    return await friendService.unfriendUserService(activeUser, to)
}

export async function getFriendStatus(request) {
    const activeUser = request?.body?.user?.username;
    const { to } = request?.params
    return await friendService.getFriendStatusService(activeUser, to)
} 