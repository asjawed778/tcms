import asyncHandler from "express-async-handler";
import { type Request, type Response } from "express";
import createHttpError from "http-errors";
import * as EmployeeService from "./employee.service";
import { createResponse } from "../common/helper/response.hepler";
import * as AddressService from "../common/services/address.service";
import * as EmployeeDto from "./employee.dto";
import * as UserService from "../user/user.service";
import * as EmplyoeeUtils from "./employee.utils";
import { Types } from "mongoose";

// new controllers
export const createEmployee = asyncHandler(async (req: Request, res: Response) => {
    const data: EmployeeDto.ICreateEmployee = req.body;
    const user = await UserService.getUserByEmail(data.email);
    if (user) {
        throw createHttpError(409, "Employee With this email Alredy Exit.");
    }
    const userDoc = await UserService.createUserByAdmin({ name: data.name, email: data.email, role: data.role });
    if (!userDoc) {
        throw createHttpError(500, "Error in Creating User, Try again")
    }
    const empId = await EmplyoeeUtils.getUniqueEmployeeId();
    const empData = {
        employeeId: empId,
        user: userDoc._id,
        fatherName: data.fatherName,
        motherName: data.motherName,
        phoneNumber: data.phoneNumber,
        gender: data.gender,
        dob: data.dob,
        photo: data.photo,
        aadhaarNumber: data.aadhaarNumber,
    };
    const empDoc = await EmployeeService.createEmployee(empData);
    res.send(createResponse(empDoc, "Employee Created successfully"));
});

export const upsertEmpAddress = asyncHandler(async (req: Request, res: Response) => {
    const data = req.body;
    const { employeeId } = req.params;
    const address = await AddressService.saveAddress(data.address);
    const result = await EmployeeService.updateEmployee(employeeId, { address: new Types.ObjectId(address._id) })
    res.send(createResponse(result, "Employee Address Updated successfully"));
});

export const updateEmpProfessionalDetails = asyncHandler(async (req: Request, res: Response) => {
    const data = req.body;
    const { employeeId } = req.params;
    const empData: Partial<EmployeeDto.IEmployee> = {
        designation: data.designation,
        dateOfJoining: data.dateOfJoining,
        experience: data.experience,
        expertise: data.expertise,
        qualification: data.qualification,
        certification: data.certification,
    };
    const result = await EmployeeService.updateEmployee(employeeId, empData);
    res.send(createResponse(result, "Employee Professional Details Updated successfully"));
});

export const upsertSalaryStructure = asyncHandler(async (req: Request, res: Response) => {
    const data = req.body;
    const { employeeId } = req.params;
    const salaryStructure: Partial<EmployeeDto.ISalaryStructure> = {
        basicPay: data.basicPay,
        hra: data.hra,
        allowances: data.allowances,
        deductions: data.deductions,
        effectiveFrom: data.effectiveFrom,
        effectiveTo: data.effectiveTo,
        remarks: data.remarks
    };
    const result = await EmployeeService.upsertSalaryStructure(employeeId, salaryStructure);
    res.send(createResponse(result, "Employee Salary Structure Updated successfully"));
});

export const upsertEmpDocuments = asyncHandler(async (req: Request, res: Response) => {
    const data = req.body;
    const { employeeId } = req.params;
    const result = await EmployeeService.updateEmployee(employeeId, { documents: data.documents })
    res.send(createResponse(result, "Employee Documents Updated successfully"));
});

// old controllers

export const getAllFaculty = asyncHandler(async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = req.query.search as string || "";
    const faculty = await EmployeeService.getAllFaculty(page, limit, search);
    if (!faculty) {
        throw createHttpError(404, "Faculty not found");
    }
    res.send(createResponse(faculty, "Faculty fetched successfully"));
});

export const getFacultyById = asyncHandler(async (req: Request, res: Response) => {
    const { facultyId } = req.params;
    const faculty = await EmployeeService.getFacultyById(facultyId);
    if (!faculty) {
        throw createHttpError(404, "Faculty not found");
    }
    res.send(createResponse(faculty, "Faculty fetched successfully"));
});

export const getUnassignedFaculty = asyncHandler(async (req: Request, res: Response) => {
    const { sessionId } = req.params;
    const { day, startTime, endTime } = req.body;

    const unassignedFaculty = await EmployeeService.getUnassignedFaculty(new Types.ObjectId(sessionId), day, startTime, endTime);
    res.send(createResponse(unassignedFaculty, "Unassigned faculty fetched successfully"));
});