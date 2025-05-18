import { Router } from "express";
import * as authMiddleware from "../common/middleware/auth.middleware";
import { catchError } from "../common/middleware/cath-error.middleware";
import * as StudentController from "./student.controller";
import * as StudentValidation from "./student.validation";
import * as Enum from "../common/constant/enum";


const router = Router();

router
    .post("/add", authMiddleware.auth, authMiddleware.roleAuth([Enum.UserRole.SUPER_ADMIN]), StudentValidation.addStudent, catchError, StudentController.addStudent)
    .get("/all/:sessionId", authMiddleware.auth, authMiddleware.roleAuth([Enum.UserRole.SUPER_ADMIN]), StudentValidation.getStudents, catchError, StudentController.getStudents)
    .get("/details/:studentId", authMiddleware.auth, authMiddleware.roleAuth([Enum.UserRole.SUPER_ADMIN]), StudentValidation.getStudentById, catchError, StudentController.getStudentById)
    .post(
        "/remark/:sessionId/:studentId",
        authMiddleware.auth,
        authMiddleware.roleAuth([Enum.UserRole.SUPER_ADMIN, Enum.UserRole.FACULTY, Enum.UserRole.PRINCIPAL, Enum.UserRole.ADMINISTRATOR]),
        StudentValidation.addRemark,
        catchError,
        StudentController.addRemark
    )

export default router;