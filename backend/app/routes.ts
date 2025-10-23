import express from "express";
import adminRoutes from "./user/admin.route";
import sessionRoutes from "./session/session.route";
import facultyRoutes from "./faculty/faculty.route";
import academincsRoutes from "./academics/admin.academics.route";
import commonRoutes from "./common/routes/common.routes";
import studentRoutes from "./student/admin.student.route";

const router = express.Router();

// admin routes
router.use("/admin", adminRoutes);
router.use("/admin/academics", academincsRoutes);
router.use("/admin/session", sessionRoutes);
router.use("/admin/faculty", facultyRoutes);

router.use("/admin/common", commonRoutes);
router.use("/admin/student", studentRoutes);



export default router;