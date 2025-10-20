import { Router } from "express";
import { catchError } from "../common/middleware/cath-error.middleware";
import * as userController from "./user.controller";
import * as userValidator from "./user.validation";
import passport from "passport";
import { roleAuth } from "../common/middleware/role-auth.middleware";

const router = Router();

router
        .post("/login",
                userValidator.login,
                catchError,
                passport.authenticate("admin-login", { session: false }),
                userController.adminLogin
        )
        .post('/logout',
                roleAuth(),
                catchError,
                userController.logout
        )
        .patch('/update-password',
                roleAuth(),
                userValidator.updatePassword,
                catchError,
                userController.updatePassword
        )
        .post('/update-access-token',
                catchError,
                userController.updateAccessToken
        )
        .post('/send-password-reset-link',
                userValidator.forgotPassword,
                userController.forgotPasswordSendToken
        )
        .post('/reset-password/:token',
                userValidator.resetPassword,
                catchError,
                userController.resetPassword
        )


export default router;
