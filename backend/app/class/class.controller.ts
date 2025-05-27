import asyncHandler from "express-async-handler";
import { type Request, type Response } from "express";
import * as ClassService from "./class.service";
import * as SessionService from "../session/session.service";
import { createResponse } from "../common/helper/response.hepler";
import createHttpError from "http-errors";
import { ICreateTimeTable } from "./class.dto";
import mongoose from "mongoose";


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

export const assignFaculty = asyncHandler(async (req: Request, res: Response) => {
    const { sessionId } = req.params;
    const { classId, sectionId, facultyId } = req.body;
    const isClassAndSectionValid = await ClassService.isClassAndSectionValid(sessionId, classId, sectionId);
    if (!isClassAndSectionValid) {
        throw createHttpError(400, "Invalid class or section");
    }
    const isSessionCurrentOrUpcoming = await SessionService.isSessionCurrentOrFuture(sessionId);
    if (!isSessionCurrentOrUpcoming) {
        throw createHttpError(400, "Session is not current or upcoming");
    }
    const result = await ClassService.assignFaculty(sectionId, facultyId);
    res.send(createResponse({}, "Faculty assigned successfully"));
});

export const removeAssignedTeacher = asyncHandler(async (req: Request, res: Response) => {
    const { sessionId } = req.params;
    const { classId, sectionId } = req.body;

    const isClassAndSectionValid = await ClassService.isClassAndSectionValid(sessionId, classId, sectionId);
    if (!isClassAndSectionValid) {
        throw createHttpError(400, "Invalid class or section");
    }

    const isSessionCurrentOrUpcoming = await SessionService.isSessionCurrentOrFuture(sessionId);
    if (!isSessionCurrentOrUpcoming) {
        throw createHttpError(400, "Session is not current or upcoming");
    }

    const result = await ClassService.removeAssignedTeacher(sectionId);
    res.send(createResponse({}, "Teacher removed successfully"));
});

export const createTimeTable = asyncHandler(async (req: Request, res: Response) => {
    const { sessionId, classId, sectionId } = req.params;
    const { weeklySchedule } = req.body;

    const isClassAndSectionValid = await ClassService.isClassAndSectionValid(sessionId, classId, sectionId);
    if (!isClassAndSectionValid) {
        throw createHttpError(400, "Invalid class or section");
    }

    const isSessionCurrentOrUpcoming = await SessionService.isSessionCurrentOrFuture(sessionId);
    if (!isSessionCurrentOrUpcoming) {
        throw createHttpError(400, "Session is not current or upcoming");
    }
    const timeTablePayload: ICreateTimeTable = {
        session: new mongoose.Types.ObjectId(sessionId),
        class: new mongoose.Types.ObjectId(classId),
        section: new mongoose.Types.ObjectId(sectionId),
        weeklySchedule: weeklySchedule
    }

    const result = await ClassService.createTimeTable(timeTablePayload);
    res.send(createResponse(timeTablePayload, "Time table created successfully"));
});

export const getTimeTableofClass = asyncHandler(async (req: Request, res: Response) => {
    const { sessionId, classId, sectionId, timeTableId } = req.params;
    let result = null;
    if (timeTableId) {
        result = await ClassService.getTimeTableofClassById(timeTableId as string);
    } else {
        if (!sessionId || !classId || !sectionId) {
            throw createHttpError(400, "Session ID, Class ID and Section ID are required"); 
        }
        const isClassAndSectionValid = await ClassService.isClassAndSectionValid(sessionId.toString(), classId.toString(), sectionId.toString());
        if (!isClassAndSectionValid) {
            throw createHttpError(400, "Invalid class or section");
        }
        result = await ClassService.getTimeTableBySectionId(sessionId as string, sectionId as string, classId as string);
    }


    res.send(createResponse(result, "Time table fetched successfully"));
});

