import express from "express";
import adminRoutes from "./user/admin.route";
import sessionRoutes from "./session/session.route";
import facultyRoutes from "./faculty/faculty.route";
import classRoutes from "./class/admin.class.route";
import commonRoutes from "./common/routes/common.routes";
import studentRoutes from "./student/admin.student.route";

const router = express.Router();

// admin routes
router.use("/admin", adminRoutes);




// old routes
router.use("/session", sessionRoutes);
router.use("/faculty", facultyRoutes);
router.use("/class", classRoutes);
router.use("/common", commonRoutes);
router.use("/student", studentRoutes);



export default router;