import { UserRanking } from "../models/userRankingModel";
import { UserMetadata } from "../models/userMetadataModel";
import Fuse from "fuse.js";

export async function setFavoriteService(username: string, favorite: string) {
    await UserRanking.findOneAndUpdate(
        { username },
        { favorite: favorite },
        { new: true } // returns the updated document
    );

    const userMetadata = new UserMetadata({ username, favoriteTeam: favorite })
    await userMetadata.save()

    return true;
}

export async function getFavoriteService(username: string) {
    return (await UserMetadata.find({ username }).findOne()).favoriteTeam
}

export async function getUserMetadataService(username: string) {
    return await UserMetadata.find({username }).findOne()
}

export async function searchUsersService(query: string) {
    const userData = await UserMetadata.find().select('username');

    const options = {
      includeScore: true,  // Optionally include score to rank results
      threshold: 0.3, // Set how strict the matching is. Lower is more exact.
      keys: ['username'], // Field to search in
    };

    const fuse = new Fuse(userData, options);
    return fuse.search(query).map(result => result.item.username);
};