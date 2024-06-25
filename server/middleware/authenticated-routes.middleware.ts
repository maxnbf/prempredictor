import { verifyToken } from "./verify-token";
import userRoutes from "../routes/userRoutes"
import { Router } from "express";

const router = Router()

router.use(verifyToken);
router.use('/user', userRoutes)

export default router;
