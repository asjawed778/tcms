import { Router } from "express";
import * as authMiddleware from "../common/middleware/auth.middleware";
import { catchError } from "../common/middleware/cath-error.middleware";
import * as FaculytyController from "./faculty.controller";
import * as FacultyValidation from "./faculty.validation";

const router = Router();

router
    .post(
        "/",
        authMiddleware.auth,
        authMiddleware.isSuperAdmin,
        FacultyValidation.createFaculty,
        catchError,
        FaculytyController.createFaculty
    )
    .get(
        "/all",
        authMiddleware.auth,
        authMiddleware.isSuperAdmin,
        catchError,
        FaculytyController.getAllFaculty
    )

export default router;
