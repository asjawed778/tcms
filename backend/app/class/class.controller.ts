import asyncHandler from "express-async-handler";
import { type Request, type Response } from "express";
import * as ClassService from "./class.service";
import { createResponse } from "../common/helper/response.hepler";
import createHttpError from "http-errors";


export const createClass = asyncHandler(async (req: Request, res: Response) => {
    const data = req.body;
    const isClassAlreadyExists = await ClassService.isClassAlreadyExists(data.name, data.session);
    if (isClassAlreadyExists) {
        throw createHttpError(400, "Class already exists for this session");
    }
    const result = await ClassService.createClass(data);
    res.send(createResponse(result, "Class created successfully"));
});

export const getAllClass = asyncHandler(async (req: Request, res: Response) => {
    const { sessionId } = req.params;
    const result = await ClassService.getAllClass(sessionId);
    res.send(createResponse(result, "Class fetched successfully"));
});

export const getClassById = asyncHandler(async (req: Request, res: Response) => {
    const { classId } = req.params;
    const result = await ClassService.getClassById(classId);
    res.send(createResponse(result, "Class fetched successfully"));
});
