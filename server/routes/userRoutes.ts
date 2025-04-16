import { Router } from "express";
import { getFavorite, getUserMetadata, searchUsers, setFavorite } from "../controllers/userController";
import { withHandler } from "../controllers/utilController"

const router = Router();

router.post("/setFavorite", withHandler(setFavorite));
router.get("/getFavorite", withHandler(getFavorite));
router.get("/getUserMetadata", withHandler(getUserMetadata))
router.get("/:query/search", withHandler(searchUsers))

export default router;