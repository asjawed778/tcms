import asyncHandler from "express-async-handler";
import { type Request, type Response } from "express";
import * as SessionService from "../session/session.service";
import createHttpError from "http-errors";
import { createResponse } from "../common/helper/response.hepler";
import * as Enum from "../common/utils/enum";
import * as StudentService from "./student.service";
import * as StudentDto from "./student.dto";
import * as classService from "../academics/academic.service";
import * as AddressService from "../common/services/address.service";
import * as ClassService from "../academics/academic.service";
import * as AcademicUtils from "../academics/academic.utils";
import mongoose, { Types } from "mongoose";
import * as AddressDto from "../common/dto/address.dto";


// personal details - step 1
export const addPersonalDetails = asyncHandler(async (req: Request, res: Response) => {
  const data = req.body;
  const studentData: StudentDto.IAddStudentPersonalDetails = {
    firstName: data.firstName,
    lastName: data.lastName,
    dob: data.dob,
    gender: data.gender,
    nationality: data.nationality,
    religion: data.religion,
    motherTongue: data.motherTongue,
    photo: data.photo,
    adharNumber: data.adharNumber,
    contactNumber: data.contactNumber,
    email: data.email,
  };
  const student = await StudentService.addStudentStep1(studentData);
  if (!student) {
    throw createHttpError(500, "Failed to add student step-1");
  }
  res.send(createResponse({ student }, "Student add Step-1 completed successfully"));
});

export const updatePersonalDetails = asyncHandler(async (req: Request, res: Response) => {
  const data = req.body;
  const { studentId } = req.params;
  const studentData: Partial<StudentDto.IAddStudentPersonalDetails> = {
    firstName: data.firstName,
    lastName: data.lastName,
    dob: data.dob,
    gender: data.gender,
    nationality: data.nationality,
    religion: data.religion,
    motherTongue: data.motherTongue,
    photo: data.photo,
    adharNumber: data.adharNumber,
    contactNumber: data.contactNumber,
    email: data.email,
  };
  const student = await StudentService.updateStudent(studentId, studentData);
  if (!student) {
    throw createHttpError(500, "Failed to Update student step-1");
  }
  res.send(createResponse({ student }, "Student Updated Step-1 completed successfully"));
});

// Adress details - step 2
export const upsertStudentAddress = asyncHandler(async (req: Request, res: Response) => {
  const data = req.body;
  const { studentId } = req.params;
  const addressData: AddressDto.ICreateAddress = {
    addressLine1: data.address.addressLine1,
    addressLine2: data.address.addressLine2,
    city: data.address.city,
    state: data.address.state,
    country: data.address.country,
    pincode: data.address.zipCode,
  };
  const studentDoc = await StudentService.getStudentById(studentId);
  if (!studentDoc) {
    throw createHttpError(404, "Student not found");
  }
  let address;
  if (studentDoc.address) {
    address = await AddressService.saveAddress(addressData, (studentDoc.address._id)?.toString());
  } else {
    address = await AddressService.saveAddress(addressData);
  }
  const result = await StudentService.updateStudent(studentId, { address: new Types.ObjectId(address._id) })
  res.send(createResponse(result, "Student Address Updated successfully"));
});

export const upsertStudentParentsInfo = asyncHandler(async (req: Request, res: Response) => {
  const { studentId } = req.params;
  const parentsData = req.body;

  const student = await StudentService.updateStudent(studentId, { father: parentsData.father, mother: parentsData.mother, localGuardian: parentsData.localGuardian });
  res.send(createResponse({ student }, "Student add Step-3 completed successfully"));
});

export const upsertStudentAdmissinInfo = asyncHandler(async (req: Request, res: Response) => {
  const { studentId } = req.params;
  const { session, class: classId, section, admissionYear, address, ...prevSchoolData } = req.body;
  const isSessionValid = await SessionService.isSessionValid(session);
  if (!isSessionValid) {
    throw createHttpError(400, "Invalid session");
  }
  const isClassValid = await AcademicUtils.isClassAndSectionValid(
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
  const enrollmentNumber = await StudentService.generateEnrollmentNumber(admissionYear);
  const student = await StudentService.updateStudent(studentId, { admissionYear, previousSchool: prevSchoolData, enrollmentNumber: enrollmentNumber });
  res.send(createResponse({ student }, "Student add Step-3 completed successfully"));
});

export const studentAdditionalDoc = asyncHandler(async (req: Request, res: Response) => {
  const { studentId } = req.params;
  const { documents } = req.body;
  const student = await StudentService.updateStudent(studentId, { documents, status: Enum.StudentStatus.ACTIVE });
  res.send(createResponse({ student }, "Student add Step-3 completed successfully"));
});

export const bulkUploadStudents = asyncHandler(async (req: Request, res: Response) => {
  const { students } = req.body;

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
      const { classId, sectionId, session, address, ...rest } = studentData;
      const classData = await ClassService.getClassByUniqueId(classId);
      const sectionData = await ClassService.getSectionByUniqueId(sectionId);

      const addressData = await AddressService.saveAddress(address);
      const enrollmentNumber = await StudentService.generateEnrollmentNumber(rest.admissionYear);
      const student = await StudentService.addStudent({
        ...rest,
        address: addressData._id,
        enrollmentNumber,
      });

      await StudentService.admissionStudentToClass(
        student._id,
        studentData.session,
        classData._id,
        sectionData._id
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
});

// old student addition function

export const getStudents = asyncHandler(async (req: Request, res: Response) => {
  const sessionId = (req.query.sessionId as string) || "";;
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const search = (req.query.search as string) || "";
  const classId = (req.query.class as string) || "";
  const sectionId = (req.query.section as string) || "";
  const gender = (req.query.gender as Enum.Gender) || "";
  const studentStatus = (req.query.status as Enum.StudentStatus) || "";
  const admissionStatus = (req.query.status as Enum.AdmissionStatus) || "";
  const bloodGroup = (req.query.bloodGroup as Enum.BloodGroup) || "";

  const result = await StudentService.getAllStudents(
    sessionId,
    page,
    limit,
    search,
    classId,
    sectionId,
    gender,
    studentStatus,
    admissionStatus,
    bloodGroup,
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
