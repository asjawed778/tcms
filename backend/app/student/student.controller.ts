import asyncHandler from "express-async-handler";
import { type Request, type Response } from "express";
import * as SessionService from "../session/session.service";
import createHttpError from "http-errors";
import { createResponse } from "../common/helper/response.hepler";
import * as Enum from "../common/constant/enum";
import * as StudentService from "./student.service";
import * as StudentDto from "./student.dto";
import * as classService from "../class/class.service";
import * as addressService from "../common/services/address.service";
import * as FacultyService from "../faculty/faculty.service";
import * as ClassService from "../class/class.service";
import mongoose from "mongoose";


export const addStudent = asyncHandler(async (req: Request, res: Response) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { session: sessionId, class: classId, section: sectionId, address, ...studentData } = req.body;
        const isSessionValid = await SessionService.isSessionValid(sessionId);
        if (!isSessionValid) {
            throw createHttpError(400, "Invalid session");
        }
        const isClassValid = await classService.isClassAndSectionValid(sessionId, classId, sectionId);
        if (!isClassValid) {
            throw createHttpError(400, "Invalid class or section");
        }
        const addressData = await addressService.createAddress(address, session);
        const student = await StudentService.addStudent({ ...studentData, address: new mongoose.Types.ObjectId(addressData._id) }, session);
        const admission = await StudentService.admissionStudentToClass(student._id, sessionId, classId, sectionId, session);

        await session.commitTransaction();
        await session.endSession();

        res.send(createResponse({ student, admission }, "Student added successfully"));
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        throw error;
    }
});

export const getStudents = asyncHandler(async (req: Request, res: Response) => {
    const { sessionId } = req.params;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = req.query.search as string || "";
    const standard = req.query.standard as string || "";
    const section = req.query.section as string || "";

    const result = await StudentService.getStudents(sessionId, page, limit, search, standard, section);
    res.send(createResponse(result, "Students fetched successfully"));
});

export const getStudentById = asyncHandler(async (req: Request, res: Response) => {
    const studentId = req.params.studentId;
    const student = await StudentService.getStudentById(studentId);
    if (!student) {
        throw createHttpError(404, "Student not found");
    }
    res.send(createResponse(student, "Student fetched successfully"));
});


export const addRemark = asyncHandler(async (req: Request, res: Response) => {
    const { studentId, sessionId } = req.params;
    if (!req.user) {
        throw createHttpError(401, "Unauthorized");
    }
    const userId = req.user._id;
    const {
        remarkType,
        description,
        actionTaken,
        supportingDocuments
    } = req.body;

    // Validate student existence
    const isStudentValid = await StudentService.getStudentById(studentId);
    if (!isStudentValid) {
        throw createHttpError(400, "Invalid student ID");
    }

    const admission = await StudentService.getAdmissionByStudentId(studentId, sessionId);
    if (!admission) {
        throw createHttpError(400, "Student not admitted to this session");
    }
    // Prepare remark data
    const remarkData: StudentDto.IRemarkCreate = {
        student: new mongoose.Types.ObjectId(studentId),
        givenBy: new mongoose.Types.ObjectId(userId),
        class: admission.class,
        section: admission.section,
        remarkType,
        description,
        actionTaken,
        supportingDocuments,
        date: new Date(),
    };

    const remark = await StudentService.addRemark(remarkData);

    res.status(201).send(createResponse({}, "Remark added successfully"));
});