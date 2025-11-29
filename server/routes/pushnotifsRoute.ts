import { Router } from "express";
import { failedNotif, saveToken } from "../controllers/pushnotifsController";
import { withHandler } from "../controllers/utilController";

const router = Router();

router.post("/save-token", withHandler(saveToken));
router.post("/failed-notif", withHandler(failedNotif));

export default router;


