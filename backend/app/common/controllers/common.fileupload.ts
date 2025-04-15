import asyncHandler from 'express-async-handler';
import { type Request, type Response } from 'express';
import { UploadedFile } from "express-fileupload";
import createHttpError from 'http-errors';
import { createResponse } from '../helper/response.hepler';
import * as AWSService from '../services/AWS.service';
// import { sendEmail } from '../common/services/email.service';


export const uploadPublicFile = asyncHandler(async (req: Request, res: Response) => {
    const allowedFields = ["image", "pdf", "video"];

    // Ensure req.files is not null or undefined
    if (!req.files) {
        throw createHttpError(400, "No files were selected.");
    }

    // Find which file is being uploaded
    let fileKey = allowedFields.find(field => req.files?.[field]);

    if (!fileKey) {
        throw createHttpError(400, "Please select a valid file to upload");
    }

    const file = req.files[fileKey] as UploadedFile;

    const uploadPath = `public/TCMS/${fileKey}`;

    const result = await AWSService.putObject(file, uploadPath);

    res.send(createResponse(result, `${fileKey} uploaded successfully to AWS`));
});