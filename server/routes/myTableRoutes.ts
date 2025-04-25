import { Router } from "express";
import { getAllFriendRankings, getAllRankings, getLive, getLiveRankingForGameWeek, getRanking, getRankingSnapshot, getRankingsByFavorite, getTimeSeriesPoints, makeRanking } from "../controllers/myTableController";
import { withHandler } from "../controllers/utilController";

const router = Router();

router.post("/ranking", withHandler(makeRanking));
router.get("/:username/ranking", withHandler(getRanking));
router.get("/:favorite/rankingByFavorite", withHandler(getRankingsByFavorite))
router.get("/live", withHandler(getLive));
router.get("/leaderboard", withHandler(getAllRankings))
router.get("/:username/getTimeSeriesPoints", withHandler(getTimeSeriesPoints))
router.get("/:gameWeek/liveRanking", withHandler(getLiveRankingForGameWeek))
router.get("/all-friends-rankings", withHandler(getAllFriendRankings))
router.get("/get-ranking-snapshot", withHandler(getRankingSnapshot))
export default router;