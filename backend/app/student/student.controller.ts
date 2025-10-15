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
    if (!Array.isArray(students) || students.length === 0) {
      throw createHttpError(400, "No student data provided.");
    }

    const results: {
      success: any[];
      failed: { index: number; error: string; data: any }[];
    } = { success: [], failed: [] };

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      for (let i = 0; i < students.length; i++) {
        const studentData = students[i];

        try {
          const {
            session: sessionName,
            class: className,
            section: sectionName,
            address,
            ...rest
          } = studentData;

          const sessionDoc = await SessionModel.findOne({ name: sessionName });
          if (!sessionDoc)
            throw new Error(`Session "${sessionName}" not found`);
          const sessionId = sessionDoc._id;
          let classId;
          let classDoc;
          if (className) {
            classDoc = await ClassModel.findOne({
              name: className,
            }).exec();
            if (!classDoc) throw new Error(`Class "${className}" not found`);
            classId = classDoc._id;
          }
          let sectionId;
          if (classDoc && sectionName) {
            const sectionDoc = await SectionModel.findOne({
              _id: { $in: classDoc.sections },
              name: sectionName,
            }).exec();
            if (!sectionDoc)
              throw new Error(
                `Section "${sectionName}" not found in class "${className}"`
              );
            sectionId = sectionDoc._id;
          }
          const addressData = await addressService.createAddress(
            address,
            session
          );
          const student = await StudentService.addStudent(
            { ...rest, address: new mongoose.Types.ObjectId(addressData._id) },
            session
          );
          if (classId && sectionId) {
            await StudentService.admissionStudentToClass(
              student._id,
              sessionId,
              classId,
              sectionId,
              session
            );
          }
          results.success.push(student);
        } catch (err: any) {
          results.failed.push({
            index: i + 1,
            error: err.message || "Unknown error",
            data: studentData,
          });
        }
      }

      await session.commitTransaction();
      await session.endSession();

      res
        .status(200)
        .send(
          createResponse(
            results,
            `Processed ${students.length} records. Success: ${results.success.length}, Failed: ${results.failed.length}`
          )
        );
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      throw error;
    }
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
