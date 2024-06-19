import { Router } from "express";
import { getAllRankings, getLive, getRanking, makeRanking } from "../controllers/userController";

const router = Router();

router.post("/ranking", makeRanking);
router.get("/:username/ranking", getRanking);
router.get("/live", getLive);
router.get("/leaderboard", getAllRankings)

export default router;