import { getFavoriteService, getUserMetadataService, searchUsersService, setFavoriteService } from "../services/userService"

export async function setFavorite(request) {
    const activeUser = request?.body?.user?.username;
    const { favorite } = request.body;
    await setFavoriteService(activeUser, favorite);
    return true;
}

export async function getFavorite(request) {
    const activeUser = request?.body?.user?.username;
    return await getFavoriteService(activeUser);
}

export async function getUserMetadata(request) {
    const activeUser = request?.body?.user?.username;
    return await getUserMetadataService(activeUser);
}

export async function searchUsers(request) {
    return await searchUsersService(request.params.query)
}