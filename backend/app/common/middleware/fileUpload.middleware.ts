import { type Request, type Response, type NextFunction } from "express";
import fileUpload from "express-fileupload";
import createHttpError from "http-errors";

const allowedTypes = [
    "image/jpeg", "image/png", "image/jpg", "image/gif", "image/webp", "image/svg+xml", "image/bmp", "image/tiff",

    "video/mp4", "video/webm", "video/ogg", "video/x-msvideo", "video/quicktime", "video/mpeg",

    // Documents
    "application/pdf",                          
    "application/msword",                             
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document", 
    "application/vnd.ms-excel",                    
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", 
    "application/vnd.ms-powerpoint",              
    "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    "text/plain"                               
];


export const handleFileUpload = (req: Request, res: Response, next: NextFunction) => {
    if (!req.files || !req.files.file) {
        throw createHttpError(400, "file is required");
    }

    const file = req.files.file as fileUpload.UploadedFile;
    const maxSize = 5 * 1024 * 1024;

    if (!allowedTypes.includes(file.mimetype)) {
        throw createHttpError(400, "file must be an image or video file");
    }

    if (file.size > maxSize) {
        throw createHttpError(400, "file must be less than 5MB");
    }

    next();
};