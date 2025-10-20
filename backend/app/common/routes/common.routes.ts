
import { Router } from "express";
import { catchError } from "../middleware/cath-error.middleware";
import * as fileUploadMiddleware from "../middleware/fileUpload.middleware";
import * as fileUploader from "../controllers/common.fileupload";
import { roleAuth } from "../middleware/role-auth.middleware";
const router = Router();

router
    .post("/upload",
        roleAuth(),
        fileUploadMiddleware.handleFileUpload,
        catchError,
        fileUploader.uploadPublicFile
    )


export default router;