import { Router } from "express";
import * as authMiddleware from "../common/middleware/auth.middleware";
import { catchError } from "../common/middleware/cath-error.middleware";
import * as ClassControler from "./class.controller";
import * as ClassValidation from "./class.validation";

const router = Router();

router
    .post(
        "/",
        authMiddleware.auth,
        authMiddleware.isSuperAdmin,
        ClassValidation.createClass,
        catchError,
        ClassControler.createClass
    )
    .get(
        "/all/:sessionId",
        authMiddleware.auth,
        authMiddleware.isSuperAdmin,
        ClassValidation.getAllClass,
        catchError,
        ClassControler.getAllClass
    )
    .get(
        "/:classId",
        authMiddleware.auth,
        authMiddleware.isSuperAdmin,
        ClassValidation.getClassById,
        catchError,
        ClassControler.getClassById
    )

export default router;
