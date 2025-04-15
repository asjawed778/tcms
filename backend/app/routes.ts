import express from "express";
import userRoutes from "./user/user.route";
import sessionRoutes from "./session/session.route";

const router = express.Router();

router.use("/user", userRoutes);
router.use("/session", sessionRoutes);



export default router;