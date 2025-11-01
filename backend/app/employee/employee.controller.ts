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
import * as Enum from "../common/utils/enum";

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

export const updateEmployeeBasicDetails = asyncHandler(async (req: Request, res: Response) => {
    const { employeeId } = req.params;
    const data = req.body;

    const empDoc = await EmployeeService.getEmployeeById(employeeId);
    if (!empDoc) {
        throw createHttpError(404, "Employee not found");
    }
    if (data.email || data.name || data.role) {
        await UserService.updateUserByAdmin(empDoc.user, {
            ...(data.name && { name: data.name }),
            ...(data.email && { email: data.email }),
            ...(data.role && { role: data.role }),
        });
    }
    const updateData: Partial<EmployeeDto.ICreateEmployee> = {
        ...(data.fatherName && { fatherName: data.fatherName }),
        ...(data.motherName && { motherName: data.motherName }),
        ...(data.phoneNumber && { phoneNumber: data.phoneNumber }),
        ...(data.gender && { gender: data.gender }),
        ...(data.dob && { dob: data.dob }),
        ...(data.photo && { photo: data.photo }),
        ...(data.aadhaarNumber && { aadhaarNumber: data.aadhaarNumber }),
    };
    const updatedEmp = await EmployeeService.updateEmployee(employeeId, updateData);
    res.send(createResponse(updatedEmp, "Employee updated successfully"));
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

export const getAllEmployee = asyncHandler(async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = req.query.search as string || "";
    const role = req.query.role as string || "";
    const gender = req.query.gender as Enum.Gender || "";
    const status = req.query.status as Enum.EmployeeStatus || "";
    const employee = await EmployeeService.getAllEmployee(page, limit, search, role, gender, status);
    res.send(createResponse(employee, "Employee fetched successfully"));
});

export const getEmployeeById = asyncHandler(async (req: Request, res: Response) => {
    const { employeeId } = req.params;
    const employee = await EmployeeService.getEmployeeById(employeeId);
    if (!employee) {
        throw createHttpError(404, "Employee not found");
    }
    res.send(createResponse(employee, "Employee detail fetched successfully"));
});

export const getEmpSalaryStructure = asyncHandler(async (req, res) => {
    const { employeeId } = req.params;
    const salary = await EmployeeService.getSalaryStructureByEmployeeId(employeeId);
    res.send(
        createResponse(
            salary,
            salary.length ? "Salary structure fetched successfully" : "No salary structure found"
        )
    );
});

// old controllers




export const getUnassignedFaculty = asyncHandler(async (req: Request, res: Response) => {
    const { sessionId } = req.params;
    const { day, startTime, endTime } = req.body;

    const unassignedFaculty = await EmployeeService.getUnassignedFaculty(new Types.ObjectId(sessionId), day, startTime, endTime);
    res.send(createResponse(unassignedFaculty, "Unassigned faculty fetched successfully"));
});