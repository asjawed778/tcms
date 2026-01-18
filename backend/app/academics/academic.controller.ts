import asyncHandler from "express-async-handler";
import { type Request, type Response } from "express";
import * as AcademicService from "./academic.service";
import * as SessionService from "../session/session.service";
import { createResponse } from "../common/helper/response.hepler";
import createHttpError from "http-errors";
import * as AcademicDto from "./academic.dto";
import * as UserService from "../user/user.service";
import * as AcademicUtils from "./academic.utils";

// subject controllers
export const upsertSubjectBulk = asyncHandler(async (req: Request, res: Response) => {
    const { subjects } = req.body;
    const { classId } = req.params;
    const result = await AcademicService.upsertSubjectBulk(classId, subjects);
    res.send(createResponse(result, "Subjects created/updated successfully"));
});

export const getSubjectsByClass = asyncHandler(
    async (req: Request, res: Response) => {
        const { classId } = req.params;
        const { sessionId, subjectType } = req.query;
        const result = await AcademicService.getSubjectsByClass({
            classId,
            sessionId: sessionId as string | undefined,
            subjectType: subjectType as string | undefined
        });

        res.send(createResponse(result, "Subjects fetched successfully"));
    }
);

export const editSubject = asyncHandler(async (req: Request, res: Response) => {
    const { subjectId } = req.params;
    const data = req.body;
    const result = await AcademicService.editSubject(subjectId, data);
    res.send(createResponse(result, "Subject edited successfully"));
});

export const deleteSubject = asyncHandler(async (req: Request, res: Response) => {
    const { subjectId } = req.params;
    await AcademicService.deleteSubject(subjectId);
    res.send(createResponse({}, "Subject deleted successfully"));
});

// section controllers
export const createSection = asyncHandler(async (req: Request, res: Response) => {
    const data = req.body;
    const result = await AcademicService.createSection(data);
    res.send(createResponse(result, "Section created successfully"));
});

export const createSectionsBulk = asyncHandler(async (req: Request, res: Response) => {
    const { sections } = req.body;
    const result = [];
    for (const section of sections) {
        const response = await AcademicService.createSection(section);
        result.push(response);
    }
    res.send(createResponse(result, "Sections created successfully"));
});

export const editSection = asyncHandler(async (req: Request, res: Response) => {
    const { sectionId } = req.params;
    const data = req.body;
    const result = await AcademicService.editSection(sectionId, data);
    res.send(createResponse(result, "Section edited successfully"));
});

export const deleteSection = asyncHandler(async (req: Request, res: Response) => {
    const { sectionId } = req.params;
    await AcademicService.deleteSection(sectionId);
    res.send(createResponse({}, "Section deleted successfully"));
});

export const getAllSections = asyncHandler(async (req: Request, res: Response) => {
    const classId = req.query.classId as string || "";
    const sessionId = req.query.sessionId as string;
    const result = await AcademicService.getAllSections(sessionId, classId);
    res.send(createResponse(result, "Sections fetched successfully"));
});


// class controllers
export const createClass = asyncHandler(async (req: Request, res: Response) => {
    const { name, session, courseStream } = req.body;
    const isSessionCurrentOrFuture = await SessionService.isSessionCurrentOrFuture(session);
    if (!isSessionCurrentOrFuture) {
        throw createHttpError(400, "Class can create for only current and future sessions");
    }
    const isClassAlreadyExists = await AcademicUtils.isClassAlreadyExists(name, session);
    if (isClassAlreadyExists) {
        throw createHttpError(400, "Class already exists for this session");
    }
    const sessionDoc = await SessionService.getSessionById(session);
    if (!sessionDoc) {
        throw createHttpError(404, "Invalid Session, Not found");
    }
    const uniqueClassId = await AcademicUtils.generateClassId(name, sessionDoc.startDate.getFullYear().toString());
    const data = {
        name,
        session,
        courseStream,
        classId: uniqueClassId
    }
    const result = await AcademicService.createClass(data);
    res.send(createResponse(result, "Class created successfully"));
});

export const updateClass = asyncHandler(async (req: Request, res: Response) => {
    const { classId } = req.params;
    const { name, session, subjects, courseStream } = req.body;
    const data = {
        name, session, subjects, courseStream
    };
    const result = await AcademicService.updateClass(classId, data);
    res.send(createResponse(result, "Class Updated successfully"));
});

export const upsertClassFeeStructure = asyncHandler(async (req: Request, res: Response) => {
    const data = req.body;
    const classId = req.params.classId;
    const feeStr = await AcademicService.getClassFeeStructure(classId);
    let result;
    if (feeStr) {
        result = await AcademicService.updateClassFeeStructure(classId, data);
    } else {
        result = await AcademicService.addClassFeeStructure(classId, data);

    }
    res.send(createResponse(result, "Fee Structure Updated successfully"));
});

export const getClassFeeStructure = asyncHandler(async (req: Request, res: Response) => {
    const classId = req.params.classId;
    const result = await AcademicService.getClassFeeStructure(classId);
    res.send(createResponse(result, "Fee Structure fetched successfully"));
});

// Timetable controllers
export const createTimeTable = asyncHandler(async (req: Request, res: Response) => {
    const { sessionId, classId, sectionId } = req.body;
    const data = req.body;
    const timeTableData: AcademicDto.IDaySchedule = {
        day: data.day,
        periods: data.periods,
        isHoliday: data.isHoliday,
        holidayReason: data.holidayReason,
    }

    const isClassAndSectionValid = await AcademicUtils.isClassAndSectionValid(sessionId, classId, sectionId);
    if (!isClassAndSectionValid) {
        throw createHttpError(400, "Invalid class or section");
    }

    const isSessionCurrentOrUpcoming = await SessionService.isSessionCurrentOrFuture(sessionId);
    if (!isSessionCurrentOrUpcoming) {
        throw createHttpError(400, "Session is not current or upcoming");
    }

    const result = await AcademicService.createTimeTable(sessionId, classId, sectionId, timeTableData);
    res.send(createResponse(result, "Time table created successfully"));
});





// olda class controllers

export const getAllClass = asyncHandler(async (req: Request, res: Response) => {
    const sessionId = req.query.sessionId as string;
    const result = await AcademicService.getAllClass(sessionId);
    res.send(createResponse(result, "Class fetched successfully"));
});

export const getClassById = asyncHandler(async (req: Request, res: Response) => {
    const { classId } = req.params;
    const result = await AcademicService.getClassById(classId);
    res.send(createResponse(result, "Class fetched successfully"));
});

export const assignFaculty = asyncHandler(async (req: Request, res: Response) => {
    const { sessionId } = req.params;
    const { classId, sectionId, facultyId } = req.body;
    const isClassAndSectionValid = await AcademicUtils.isClassAndSectionValid(sessionId, classId, sectionId);
    if (!isClassAndSectionValid) {
        throw createHttpError(400, "Invalid class or section");
    }
    const isSessionCurrentOrUpcoming = await SessionService.isSessionCurrentOrFuture(sessionId);
    if (!isSessionCurrentOrUpcoming) {
        throw createHttpError(400, "Session is not current or upcoming");
    }
    const isFacultyExists = await UserService.isFaculty(facultyId);
    if (!isFacultyExists) {
        throw createHttpError(400, "Faculty does not exist or is not a valid faculty");
    }
    const result = await AcademicService.assignFaculty(sectionId, facultyId);
    res.send(createResponse({}, "Faculty assigned successfully"));
});

export const removeAssignedTeacher = asyncHandler(async (req: Request, res: Response) => {
    const { sessionId } = req.params;
    const { classId, sectionId } = req.body;

    const isClassAndSectionValid = await AcademicUtils.isClassAndSectionValid(sessionId, classId, sectionId);
    if (!isClassAndSectionValid) {
        throw createHttpError(400, "Invalid class or section");
    }

    const isSessionCurrentOrUpcoming = await SessionService.isSessionCurrentOrFuture(sessionId);
    if (!isSessionCurrentOrUpcoming) {
        throw createHttpError(400, "Session is not current or upcoming");
    }

    const result = await AcademicService.removeAssignedTeacher(sectionId);
    res.send(createResponse({}, "Teacher removed successfully"));
});

export const getTimeTableofClass = asyncHandler(async (req: Request, res: Response) => {
    const { sessionId, classId, sectionId, timeTableId } = req.params;
    let result = null;
    if (timeTableId) {
        result = await AcademicService.getTimeTableofClassById(timeTableId as string);
    } else {
        if (!sessionId) {
            throw createHttpError(400, "Session ID is reuired");
        }
        const isClassAndSectionValid = await AcademicUtils.isClassAndSectionValid(sessionId.toString(), classId.toString(), sectionId.toString());
        if (!isClassAndSectionValid) {
            throw createHttpError(400, "Invalid class or section");
        }
        result = await AcademicService.getTimeTableBySectionId(sessionId as string, sectionId as string, classId as string);
    }

    res.send(createResponse(result, "Time table fetched successfully"));
});