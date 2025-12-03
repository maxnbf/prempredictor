import { FriendRequest } from "../models/friendRequestModel";
import { Notif } from "../models/notificationModel";
import { Friends } from "../models/friendModel"
import * as userService from "./userService"
import { assignFriendRankService } from "./rankSnapshotService";
import { sendPushNotificationToUser } from "./pushNotificationService";

export async function sendRequest(from, to) {
  // 1. Save friend request
  const request = new FriendRequest({ from, to, state: "request" });
  await request.save();

  // 2. Save notification record
  const notif = new Notif({ from, to, notifType: "sentRequest", seen: false });
  await notif.save();

  // 3. Send push notification to the recipient
  await sendPushNotificationToUser(
    to, 
    "New Friend Request",
    `${from} has sent you a friend request.`,
    { from }
  );

  return true;
}


export async function rejectRequest(from, to) {
  await FriendRequest.deleteOne({ from, to });
  await Notif.deleteOne({ from, to });
  return true;
}

export async function getAllFriendRequestService(username) {
  const requests = await FriendRequest.find({ to: username })
  const sentRequests = await Notif.find({ to: username, notifType: "sentRequest" });
  sentRequests.forEach(notif => { notif.seen = true; notif.save()})

  return requests
}

export async function unfriendUserService(from, to) {
  await Friends.deleteOne({
    $or: [
      { from: from, to: to },
      { from: to, to: from }
    ]
  });
  await Notif.deleteOne({
    notifType: "acceptedRequest",
    $or: [
      { from: from, to: to },
      { from: to, to: from }
    ]
  });
      // TODO: reevallate this just for the active user
  await assignFriendRankService();
  return true;
}

export async function getFriendStatusService(from, to) {
  // from = active user
  // to = other user
  const isFriends = await Friends.findOne({ from, to }) || await Friends.findOne({ from: to, to: from })
  if (isFriends) return { isFriends: true };


  const friendRequest = await FriendRequest.findOne({ from, to, state: "request" })
  if (friendRequest) { 
    return { isFriends: false, request: friendRequest }
  }

  const friendRequestReversed = await FriendRequest.findOne({ from: to, to: from, state: "request" })
  if (friendRequestReversed) { 
    return { isFriends: false, request: friendRequestReversed }
  }
}


export async function getFriends(username, activeUser) {
  const friends = await Friends.find({
    $or: [
      { from: username },
      { to: username }
    ]
  });

  const friendPromises = friends.map(friend => userService.getUserMetadataService(friend.to == activeUser ? friend.from : friend.to));
  const friendProfiles = await Promise.all(friendPromises);
  // TODO: If username != activeUser
    // query if active user is friends with each friend listed
  const isFriendProfiles = friendProfiles.map(profile => { return { user: profile.toJSON(), isFriend: username == activeUser } });

  return isFriendProfiles;
}

export async function acceptRequest(from, to) {
  const request = await FriendRequest.findOne({ from, to, state: "request"})

  if (request) {
    const newFriends = new Friends({ from: from, to: to });
    await newFriends.save();
    await Notif.findOneAndUpdate({from, to, notifType: "sentRequest"}, { $set: {notifType: "acceptedRequest", seen: "false"}})
    await FriendRequest.deleteOne({ from, to });
        // TODO: reevallate this just for the active user
    await assignFriendRankService();
  }
}