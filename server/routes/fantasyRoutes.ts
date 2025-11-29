import { getFantasyRanking, getFixtures, getUserPoints, submitFantasyRanking, submitPredictions } from "../controllers/fantasyController"
import { withHandler } from "../controllers/utilController"
import express from "express";


const router = express.Router();

router.get("/:gameweek/getFixtures", withHandler(getFixtures))
router.post("/submitPredictions", withHandler(submitPredictions))
router.get("/:gameweek/getFantasyRanking", withHandler(getFantasyRanking))
router.post("/:gameweek/submitFantasyRanking", withHandler(submitFantasyRanking))
router.get("/userPoints", withHandler(getUserPoints))

export default router;