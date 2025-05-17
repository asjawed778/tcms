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
        authMiddleware.roleAuth([Enum.UserRole.SUPER_ADMIN]),
        ClassValidation.createClass,
        catchError,
        ClassControler.createClass
    )
    .get(
        "/all/:sessionId",
        authMiddleware.auth,
        authMiddleware.roleAuth([Enum.UserRole.SUPER_ADMIN]),
        ClassValidation.getAllClass,
        catchError,
        ClassControler.getAllClass
    )
    .get(
        "/:classId",
        authMiddleware.auth,
        authMiddleware.roleAuth([Enum.UserRole.SUPER_ADMIN]),
        ClassValidation.getClassById,
        catchError,
        ClassControler.getClassById
    )

export default router;
