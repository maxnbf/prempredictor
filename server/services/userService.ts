import { UserRanking } from "../models/userRankingModel";
import { UserMetadata } from "../models/userMetadataModel";
import Fuse from "fuse.js";
import { Friends } from "../models/friendModel";
import { UserRankSnapshot } from "../models/userRankSnapshotModel";
import { Notif } from "../models/notificationModel";
import { FriendRequest } from "../models/friendRequestModel";
import { User } from "../models/userModel";
import { assignFavoriteTeamRankService, assignFriendRankService, assignOverallRankService, assignTopLevelStatsService } from "./rankSnapshotService";

export async function setFavoriteService(username: string, favorite: string) {
    await UserRanking.findOneAndUpdate(
        { username },
        { favorite: favorite }
    );

    const userMetadata = new UserMetadata({ username, favoriteTeam: favorite, dateJoined: new Date() });
    await userMetadata.save()

    return true;
}

export async function getFavoriteService(username: string) {
    return (await UserRanking.find({ username }).findOne()).favorite
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

export async function getUserProfileService(username: string) {
    const userRanking = await UserRanking.findOne({ username })
    const userMetadata = await UserMetadata.findOne({ username })
    const friends = await Friends.find({
        $or: [
          { from: username },
          { to: username }
        ]
      });
    
    return { favoriteTeam: userRanking.favorite, total: userRanking.total, username: username, joined: userMetadata.dateJoined ?? new Date(), friendCount: friends.length, fullName: userMetadata.fullName }
}

export async function deleteAccountService(username: string) {
    await UserRanking.findOneAndDelete({ username });
    await UserMetadata.findOneAndDelete({ username });
    await Friends.deleteMany({
        $or: [
          { from: username },
          { to: username }
        ]
    });
    await User.findOneAndDelete({ username }); 
    await UserRankSnapshot.findOneAndDelete({ username });
    await Notif.deleteMany({
        $or: [
            { from: username },
            { to: username }
        ]
    });
    
    await FriendRequest.deleteMany({
        $or: [
            { from: username },
            { to: username }
        ]
    });
    
    await assignFavoriteTeamRankService();
    await assignOverallRankService();
    await assignFriendRankService();
    await assignTopLevelStatsService();
}