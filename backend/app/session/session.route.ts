import { Router } from "express";
import * as SessionController from "./session.controller";
import * as SessionValidation from "./session.validation";
import * as Enum from "../common/utils/enum";
import { catchError } from "../common/middleware/cath-error.middleware";
import { roleAuth } from "../common/middleware/role-auth.middleware";


const router = Router();

router
    .post(
        "/",
        roleAuth({ module: Enum.ModuleName.SESSION, operation: Enum.Operation.CREATE }),
        SessionValidation.createSession,
        catchError,
        SessionController.createSession
    )
    .put(
        "/:sessionId",
        roleAuth({ module: Enum.ModuleName.SESSION, operation: Enum.Operation.UPDATE }),
        SessionValidation.updateSession,
        catchError,
        SessionController.updatedSession
    )
    .get("/", SessionController.getAllSession)
    .get("/:sessionId",
        roleAuth(),
        catchError,
        SessionValidation.getSession,
        SessionController.getSingleSession
    )
    .delete("/:sessionId",
        roleAuth({ module: Enum.ModuleName.SESSION, operation: Enum.Operation.DELETE }),
        SessionValidation.getSession,
        catchError,
        SessionController.deleteSession
    );

export default router;
