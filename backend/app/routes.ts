import express from "express";
import userRoutes from "./user/user.route";
import sessionRoutes from "./session/session.route";
import facultyRoutes from "./faculty/faculty.route";


const router = express.Router();

router.use("/user", userRoutes);
router.use("/session", sessionRoutes);
router.use("/faculty", facultyRoutes);



export default router;