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
import ClassModel from "../class/class.schema";
import SectionModel from "../class/section.schema";

// personal details - step 1
export const addStudentStep1 = asyncHandler(async (req: Request, res: Response) => {
  const data = req.body;
  const student = await StudentService.addStudentStep1(data);
  if (!student) {
    throw createHttpError(500, "Failed to add student step-1");
  }
  res.send(createResponse({ student }, "Student add Step-1 completed successfully"));
});

// Adress details - step 2
export const addStudentStep2 = asyncHandler(async (req: Request, res: Response) => {
  const { studentId } = req.params;

  const addressData = req.body;
  const address = await addressService.saveAddress(addressData);
  if (!address) {
    throw createHttpError(500, "Failed to add address");
  }
  const student = await StudentService.updateStudent(studentId, { address: new mongoose.Types.ObjectId(address._id) });
  res.send(createResponse({ student }, "Student add Step-2 completed successfully"));
});

export const addStudentStep3 = asyncHandler(async (req: Request, res: Response) => {
  const { studentId } = req.params;
  const parentsData = req.body;

  const student = await StudentService.updateStudent(studentId, { father: parentsData.father, mother: parentsData.mother, localGuardian: parentsData.localGuardian });
  res.send(createResponse({ student }, "Student add Step-3 completed successfully"));
});

export const addStudentStep4 = asyncHandler(async (req: Request, res: Response) => {
  const { studentId } = req.params;
  const { session, class: classId, section, admissionYear, ...prevSchoolData } = req.body;
  const isSessionValid = await SessionService.isSessionValid(session);
  if (!isSessionValid) {
    throw createHttpError(400, "Invalid session");
  }
  const isClassValid = await classService.isClassAndSectionValid(
    session,
    classId,
    section
  );
  if (!isClassValid) {
    throw createHttpError(400, "Invalid class or section");
  }
  const admission = await StudentService.admissionStudentToClass(studentId, session, classId, section);
  if (!admission) {
    throw createHttpError(500, "Failed to admit student to class");
  }
  const student = await StudentService.updateStudent(studentId, { admissionYear, previousSchool: prevSchoolData });
  res.send(createResponse({ student }, "Student add Step-3 completed successfully"));
});

export const addStudentStep5 = asyncHandler(async (req: Request, res: Response) => {
  const { studentId } = req.params;
  const { documents } = req.body;

  const student = await StudentService.updateStudent(studentId, { documents });
  res.send(createResponse({ student }, "Student add Step-3 completed successfully"));
});


// old student addition function


export const bulkUploadStudents = asyncHandler(async (req: Request, res: Response) => {
  const { students, sessionId } = req.body;

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

      if (!sessionId) throw createHttpError(404, "Session ID missing");
      if (!classId) throw createHttpError(404, "Class ID missing");
      if (!sectionId) throw createHttpError(404, "Section ID missing");
      if (!mongoose.Types.ObjectId.isValid(sessionId))
        throw createHttpError(404, `Invalid sessionId: ${sessionId}`);

      const classDoc = await ClassModel.findOne({ classId }).exec();
      if (!classDoc)
        throw createHttpError(`Class not found for classId: ${classId}`);

      const sectionDoc = await SectionModel.findOne({
        sectionId,
        _id: { $in: classDoc.sections },
      }).exec();
      if (!sectionDoc)
        throw createHttpError(
          `Section with sectionId ${sectionId} not found under class ${classDoc.name}`
        );

      const addressData = await addressService.saveAddress(address);

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
