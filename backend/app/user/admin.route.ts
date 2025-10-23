import { Router } from "express";
import { catchError } from "../common/middleware/cath-error.middleware";
import * as userController from "./user.controller";
import * as userValidator from "./user.validation";
import passport from "passport";
import { roleAuth } from "../common/middleware/role-auth.middleware";
import { ModuleName, Operation, SubModuleName } from "../common/utils/enum";

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

        // roles and permissions routes
        .post('/role',
                roleAuth({ module: ModuleName.ADMINISTRATION, subModule: SubModuleName.ROLES, operation: Operation.CREATE }),
                userValidator.createRole,
                catchError,
                userController.createRole
        )
        .put('/role/:roleId/permission',
                roleAuth({ module: ModuleName.ADMINISTRATION, subModule: SubModuleName.ROLES, operation: Operation.UPDATE }),
                userValidator.updateRole,
                catchError,
                userController.updateRole
        )
        .delete('/role/:roleId',
                roleAuth({ module: ModuleName.ADMINISTRATION, subModule: SubModuleName.ROLES, operation: Operation.DELETE }),
                userValidator.deleteRole,
                catchError,
                userController.deleteRole
        )
        .get('/role/all',
                roleAuth({ module: ModuleName.ADMINISTRATION, subModule: SubModuleName.ROLES, operation: Operation.READ }),
                userValidator.getAllRoles,
                catchError,
                userController.getAllRoles
        )
        .get('/role/:roleId',
                roleAuth({ module: ModuleName.ADMINISTRATION, subModule: SubModuleName.ROLES, operation: Operation.READ }),
                userValidator.getRoleById,
                catchError,
                userController.getRoleById
        )




export default router;
