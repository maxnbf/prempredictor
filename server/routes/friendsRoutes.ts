import { acceptRequest, rejectRequest, sendRequest, getFriends, getAllFriendRequest, unfriendUser, getFriendStatus} from "../controllers/friendsController";
import { withHandler} from "../controllers/utilController"
import express from "express";

const router = express.Router();

router.post("/:to/send-request", withHandler(sendRequest))
router.post("/:from/accept-request", withHandler(acceptRequest))
router.get("/:username/get-friends", withHandler(getFriends))
router.post("/:from/reject-request", withHandler(rejectRequest))
router.get("/get-all-requests", withHandler(getAllFriendRequest))
router.post("/:to/unfriend-user", withHandler(unfriendUser))
router.get("/:to/get-friend-status", withHandler(getFriendStatus))

export default router;