import { Router } from "express";
import * as SessionController from "./session.controller";
import * as SessionValidation from "./session.validation";
import * as authMiddleware from "../common/middleware/auth.middleware";
import * as Enum from "../common/constant/enum";
import { catchError } from "../common/middleware/cath-error.middleware";


const router = Router();

router
    .post(
        "/",
        authMiddleware.auth,
        authMiddleware.roleAuth([Enum.UserRole.SUPER_ADMIN]),
        SessionValidation.createSession,
        catchError,
        SessionController.createSession
    )
    .put(
        "/:sessionId",
        authMiddleware.auth,
        authMiddleware.roleAuth([Enum.UserRole.SUPER_ADMIN]),
        SessionValidation.updateSession,
        catchError,
        SessionController.updatedSession
    )
    .get("/", SessionController.getAllSession)
    .get("/:sessionId", authMiddleware.auth, catchError, SessionValidation.getSession, SessionController.getSingleSession)
    .delete("/:sessionId", authMiddleware.auth, SessionValidation.getSession, catchError, SessionController.deleteSession);

export default router;
