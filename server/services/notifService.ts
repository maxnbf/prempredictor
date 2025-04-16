import { Notif } from "../models/notificationModel";

export async function getNotifs(username) {
    // TODO: consolidate this logic. can prob just be one query
    const acceptedRequests = await Notif.find({to: username, notifType: "acceptedRequest"});
    const newNotifs = await Notif.countDocuments({to: username, seen: false});

    acceptedRequests.forEach(notif => { notif.seen = true; notif.save()})

    const notifs = acceptedRequests.map(req => { return {...req.toJSON(), metadata: "is now your friend"}});

    return { notifs, newNotifs};
}
