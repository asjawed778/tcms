import express from "express";
import userRoutes from "./user/user.route";
import sessionRoutes from "./session/session.route";
import facultyRoutes from "./faculty/faculty.route";
import classRoutes from "./class/class.route";
import commonRoutes from "./common/routes/common.routes";
import studentRoutes from "./student/student.route";

const router = express.Router();

router.use("/user", userRoutes);
router.use("/session", sessionRoutes);
router.use("/faculty", facultyRoutes);
router.use("/class", classRoutes);
router.use("/common", commonRoutes);
router.use("/student", studentRoutes);



export default router;