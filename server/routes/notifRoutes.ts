import { Router } from "express";
import { getNotifs } from "../controllers/notifController"
import { withHandler } from "../controllers/utilController";

const router = Router()

router.get("/get-notifs", withHandler(getNotifs));

export default router;
