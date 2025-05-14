import { Router } from "express";
import * as authMiddleware from "../common/middleware/auth.middleware";
import { catchError } from "../common/middleware/cath-error.middleware";
import * as StudentController from "./student.controller";
import * as StudentValidation from "./student.validation";


const router = Router();

router
    .post("/add", authMiddleware.auth, authMiddleware.isSuperAdmin, StudentValidation.addStudent, catchError, StudentController.addStudent)
    .get("/all/:session", authMiddleware.auth, authMiddleware.isSuperAdmin, StudentValidation.getStudents, catchError, StudentController.getStudents)

export default router;