import express from "express";
import userRoutes from "./user/user.route";

const router = express.Router();

router.use("/user", userRoutes);



export default router;