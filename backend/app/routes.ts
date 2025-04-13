import express from "express";
import userRoutes from "./user/user.route";
import sessionRoutes from "./session/session.route";
import facultyRoutes from "./faculty/faculty.route";
import classRoutes from "./class/class.route";

const router = express.Router();

router.use("/user", userRoutes);
router.use("/session", sessionRoutes);
router.use("/faculty", facultyRoutes);
router.use("/class", classRoutes);



export default router;