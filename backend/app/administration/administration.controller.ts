import { type Request, type Response } from 'express';
import * as AdministrationService from './administration.service';
import asyncHandler from 'express-async-handler';

export const upserClassNameBulk = asyncHandler(async (req: Request, res: Response) => {
    const data = req.body;
    const result = [];
    for (const className of data.classNames) {
        if (className._id) {
            const className = await AdministrationService.
            
            await updateClassName(className._id, className);
        } else {
            // Create new class name
            await createClassName(className);
        }
});