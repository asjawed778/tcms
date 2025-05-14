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
        console.log(isClassValid);
        if (!isClassValid) {
            throw createHttpError(400, "Invalid class or section");
        }
        const addressData = await addressService.createAddress(address, session);
        const student = await StudentService.addStudent({ ...studentData, address: new mongoose.Types.ObjectId(addressData._id) }, session);
        const admission = await StudentService.admissionStudentToClass(student._id, sessionId, classId, sectionId, session);
        res.send(createResponse({ student, admission }, "Student added successfully"));
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        throw error;
    }
});

export const getStudents = asyncHandler(async (req: Request, res: Response) => {
    const session = req.params.session;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = req.query.search as string || "";
    const standard = req.query.standard as string || "";
    const section = req.query.section as string || "";

    const result = await StudentService.getStudents(session, page, limit, search, standard, section);
});