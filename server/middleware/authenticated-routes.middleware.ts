import { verifyToken } from "./verify-token";
import userRoutes from "../routes/userRoutes";
import myTableRoutes from "../routes/myTableRoutes";
import friendRoutes from "../routes/friendsRoutes";
import notifRoutes from "../routes/notifRoutes";
import utilRoutes from "../routes/utilRoutes";
import pushnotifsRoutes from "../routes/pushnotifsRoute";
import { Router } from "express";

const router = Router()

router.use('/util', utilRoutes)
router.use(verifyToken);
router.use('/user', userRoutes)
router.use('/myTable', myTableRoutes)
router.use('/friends', friendRoutes)
router.use('/notifs', notifRoutes)
router.use('/pushnotifs', pushnotifsRoutes)

export default router;
