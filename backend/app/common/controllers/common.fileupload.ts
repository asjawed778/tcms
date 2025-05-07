import asyncHandler from 'express-async-handler';
import { type Request, type Response } from 'express';
import fileUpload, { UploadedFile } from "express-fileupload";
import createHttpError from 'http-errors';
import { createResponse } from '../helper/response.hepler';
import * as AWSService from '../services/AWS.service';
// import { sendEmail } from '../common/services/email.service';


export const uploadPublicFile = asyncHandler(async (req: Request, res: Response) => {

    if (!req.files) {
        throw createHttpError(400, "No files were selected.");
    }

    let file: fileUpload.UploadedFile;

    if (Array.isArray(req.files.file)) {
        file = req.files.file[0];
    } else {
        file = req.files.file as fileUpload.UploadedFile;
    }
    const fileKey = `${Date.now()}-${file.name}`;

    const uploadPath = `public/TCMS/${fileKey}`;

    const result = await AWSService.putObject(file, uploadPath);

    res.send(createResponse(result, `${fileKey} uploaded successfully to AWS`));
});