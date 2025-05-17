import { Router } from "express";
import * as authMiddleware from "../common/middleware/auth.middleware";
import { catchError } from "../common/middleware/cath-error.middleware";
import * as FaculytyController from "./faculty.controller";
import * as FacultyValidation from "./faculty.validation";
import * as Enum from "../common/constant/enum";

const router = Router();

router
    .post(
        "/",
        authMiddleware.auth,
        authMiddleware.roleAuth([Enum.UserRole.SUPER_ADMIN]),
        FacultyValidation.createFaculty,
        catchError,
        FaculytyController.createFaculty
    )
    .get(
        "/all",
        authMiddleware.auth,
        authMiddleware.roleAuth([Enum.UserRole.SUPER_ADMIN]),
        catchError,
        FaculytyController.getAllFaculty
    )
    .get(
        "/:facultyId",
        authMiddleware.auth,
        authMiddleware.roleAuth([Enum.UserRole.SUPER_ADMIN]),
        FacultyValidation.getFacultyById,
        catchError,
        FaculytyController.getFacultyById
    )


export default router;
