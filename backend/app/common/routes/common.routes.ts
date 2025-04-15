
import { Router } from "express";
import { catchError } from "../middleware/cath-error.middleware";
import * as authMiddlerware from "../middleware/auth.middleware";
import * as fileUploadMiddleware from "../middleware/fileUpload.middleware";
import * as fileUploader from "../controllers/common.fileupload"
const router = Router();

router
    .post("/image", authMiddlerware.auth, authMiddlerware.isSuperAdmin, fileUploadMiddleware.imageUpload, catchError, fileUploader.uploadPublicFile)


export default router;