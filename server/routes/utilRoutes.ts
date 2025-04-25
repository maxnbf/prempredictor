import { Router } from "express";
import { getTeamLogos, withHandler } from "../controllers/utilController";

const router = Router();

router.get("/getLogos", withHandler(getTeamLogos));

export default router;