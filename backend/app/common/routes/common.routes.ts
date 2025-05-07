
import { Router } from "express";
import { catchError } from "../middleware/cath-error.middleware";
import * as authMiddlerware from "../middleware/auth.middleware";
import * as fileUploadMiddleware from "../middleware/fileUpload.middleware";
import * as fileUploader from "../controllers/common.fileupload"
const router = Router();

router
    .post("/upload", authMiddlerware.auth, authMiddlerware.isSuperAdmin, fileUploadMiddleware.handleFileUpload, catchError, fileUploader.uploadPublicFile)


export default router;