import { Router } from "express";
import { saveToken } from "../controllers/pushnotifsController";
import { withHandler } from "../controllers/utilController";

const router = Router();

router.post("/save-token", withHandler(saveToken));

export default router;

