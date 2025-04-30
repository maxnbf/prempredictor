import { Router } from "express";
import { deleteAccount, getFavorite, getUserMetadata, getUserProfile, searchUsers, setFavorite } from "../controllers/userController";
import { withHandler } from "../controllers/utilController"

const router = Router();

router.post("/setFavorite", withHandler(setFavorite));
router.get("/getFavorite", withHandler(getFavorite));
router.get("/getUserMetadata", withHandler(getUserMetadata))
router.get("/:query/search", withHandler(searchUsers))
router.get("/getProfile", withHandler(getUserProfile))
router.get("/deleteAccount", withHandler(deleteAccount))

export default router;