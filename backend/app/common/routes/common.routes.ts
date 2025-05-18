
import { Router } from "express";
import { catchError } from "../middleware/cath-error.middleware";
import * as authMiddlerware from "../middleware/auth.middleware";
import * as fileUploadMiddleware from "../middleware/fileUpload.middleware";
import * as fileUploader from "../controllers/common.fileupload";
import * as Enum from "../constant/enum";
const router = Router();

router
    .post("/upload", authMiddlerware.auth, authMiddlerware.roleAuth([Enum.UserRole.SUPER_ADMIN]), fileUploadMiddleware.handleFileUpload, catchError, fileUploader.uploadPublicFile)


export default router;