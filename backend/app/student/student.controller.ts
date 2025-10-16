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
import SessionModel from "../session/session.schema";
import ClassModel from "../class/class.schema";
import SectionModel from "../class/section.schema";

export const addStudent = asyncHandler(async (req: Request, res: Response) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const {
      session: sessionId,
      class: classId,
      section: sectionId,
      address,
      ...studentData
    } = req.body;
    const isSessionValid = await SessionService.isSessionValid(sessionId);
    if (!isSessionValid) {
      throw createHttpError(400, "Invalid session");
    }
    const isClassValid = await classService.isClassAndSectionValid(
      sessionId,
      classId,
      sectionId
    );
    if (!isClassValid) {
      throw createHttpError(400, "Invalid class or section");
    }
    const addressData = await addressService.createAddress(address, session);
    const student = await StudentService.addStudent(
      { ...studentData, address: new mongoose.Types.ObjectId(addressData._id) },
      session
    );
    const admission = await StudentService.admissionStudentToClass(
      student._id,
      sessionId,
      classId,
      sectionId,
      session
    );

    await session.commitTransaction();
    await session.endSession();

    res.send(
      createResponse({ student, admission }, "Student added successfully")
    );
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
});

export const bulkUploadStudents = asyncHandler(
  async (req: Request, res: Response) => {
    const students = req.body.students;
    const sessionId = req.body.sessionId;

    if (!Array.isArray(students) || students.length === 0) {
      throw createHttpError(400, "No student data provided.");
    }

    const results: {
      success: any[];
      failed: { row: number; name?: string; error: string; data: any }[];
    } = { success: [], failed: [] };

    for (let i = 0; i < students.length; i++) {
      const studentData = students[i];
      try {
        const { classId, sectionId, address, name, ...rest } = studentData;

        if (!sessionId) throw new Error("Session ID missing");
        if (!classId) throw new Error("Class ID missing");
        if (!sectionId) throw new Error("Section ID missing");
        if (!mongoose.Types.ObjectId.isValid(sessionId))
          throw new Error(`Invalid sessionId: ${sessionId}`);

        const classDoc = await ClassModel.findOne({ classId }).exec();
        if (!classDoc)
          throw new Error(`Class not found for classId: ${classId}`);

        const sectionDoc = await SectionModel.findOne({
          sectionId,
          _id: { $in: classDoc.sections },
        }).exec();
        if (!sectionDoc)
          throw new Error(
            `Section with sectionId ${sectionId} not found under class ${classDoc.name}`
          );

        const addressData = await addressService.createAddress(address);

        const student = await StudentService.addStudent({
          ...rest,
          name,
          address: addressData._id,
        });

        await StudentService.admissionStudentToClass(
          student._id,
          sessionId,
          classDoc._id,
          sectionDoc._id
        );

        results.success.push(student);
      } catch (err: any) {
        results.failed.push({
          row: i + 2,
          name: studentData.name || "Unnamed Student",
          error: err.message || "Unknown error",
          data: studentData,
        });

        console.error(`Error processing student at row ${i + 2}:`, err.message);
      }
    }

    res
      .status(200)
      .send(
        createResponse(
          results,
          `Processed ${students.length} records. Success: ${results.success.length}, Failed: ${results.failed.length}`
        )
      );
  }
);

export const getStudents = asyncHandler(async (req: Request, res: Response) => {
  const { sessionId } = req.params;
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const search = (req.query.search as string) || "";
  const standard = (req.query.standard as string) || "";
  const section = (req.query.section as string) || "";

  const result = await StudentService.getStudents(
    sessionId,
    page,
    limit,
    search,
    standard,
    section
  );
  res.send(createResponse(result, "Students fetched successfully"));
});

export const getStudentById = asyncHandler(
  async (req: Request, res: Response) => {
    const studentId = req.params.studentId;
    const student = await StudentService.getStudentById(studentId);
    if (!student) {
      throw createHttpError(404, "Student not found");
    }
    res.send(createResponse(student, "Student fetched successfully"));
  }
);

export const addRemark = asyncHandler(async (req: Request, res: Response) => {
  const { studentId, sessionId } = req.params;
  if (!req.user) {
    throw createHttpError(401, "Unauthorized");
  }
  const userId = req.user._id;
  const { remarkType, description, actionTaken, supportingDocuments } =
    req.body;

  // Validate student existence
  const isStudentValid = await StudentService.getStudentById(studentId);
  if (!isStudentValid) {
    throw createHttpError(400, "Invalid student ID");
  }

  const admission = await StudentService.getAdmissionByStudentId(
    studentId,
    sessionId
  );
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
