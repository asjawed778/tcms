import { Router } from "express";
import * as authMiddleware from "../common/middleware/auth.middleware";
import { catchError } from "../common/middleware/cath-error.middleware";
import * as ClassControler from "./class.controller";
import * as ClassValidation from "./class.validation";
import * as Enum from "../common/constant/enum";

const router = Router();

router
    .post(
        "/",
        authMiddleware.auth,
        authMiddleware.roleAuth([Enum.UserRole.SUPER_ADMIN, Enum.UserRole.PRINCIPAL]),
        ClassValidation.createClass,
        catchError,
        ClassControler.createClass
    )
    .get(
        "/all/:sessionId",
        authMiddleware.auth,
        authMiddleware.roleAuth([Enum.UserRole.SUPER_ADMIN, Enum.UserRole.PRINCIPAL]),
        ClassValidation.getAllClass,
        catchError,
        ClassControler.getAllClass
    )
    .get(
        "/:classId",
        authMiddleware.auth,
        authMiddleware.roleAuth([Enum.UserRole.SUPER_ADMIN, Enum.UserRole.PRINCIPAL]),
        ClassValidation.getClassById,
        catchError,
        ClassControler.getClassById
    )
    .patch(
        "/assign-faculty/:sessionId",
        authMiddleware.auth,
        authMiddleware.roleAuth([Enum.UserRole.SUPER_ADMIN, Enum.UserRole.PRINCIPAL]),
        ClassValidation.assignFaculty,
        catchError,
        ClassControler.assignFaculty
    )
    .patch(
        "/remove-faculty/:sessionId",
        authMiddleware.auth,
        authMiddleware.roleAuth([Enum.UserRole.SUPER_ADMIN, Enum.UserRole.PRINCIPAL]),
        ClassValidation.removeFaculty,
        catchError,
        ClassControler.removeAssignedTeacher
    )
    .post(
        "/timetable/:sessionId/:classId/:sectionId",
        authMiddleware.auth,
        authMiddleware.roleAuth([Enum.UserRole.SUPER_ADMIN, Enum.UserRole.PRINCIPAL]),
        ClassValidation.createTimeTable,
        catchError,
        ClassControler.createTimeTable
    )
    .get(
        "/timetable/:sessionId/:classId/:sectionId",
        authMiddleware.auth,
        authMiddleware.roleAuth([Enum.UserRole.SUPER_ADMIN, Enum.UserRole.PRINCIPAL]),
        ClassValidation.getTimeTableofClass,
        catchError,
        ClassControler.getTimeTableofClass
    )
    

export default router;
