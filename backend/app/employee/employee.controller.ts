import { type Request, type Response } from "express";
import asyncHandler from "express-async-handler";
import { createResponse } from "../common/helper/response.hepler";
import { Types } from "mongoose";
import createHttpError from "http-errors";
import * as EmployeeService from "./employee.service";
import * as AddressService from "../common/services/address.service";
import * as EmployeeDto from "./employee.dto";
import * as UserService from "../user/user.service";
import * as EmplyoeeUtils from "./employee.utils";
import * as Enum from "../common/utils/enum";



export const createEmployee = asyncHandler(async (req: Request, res: Response) => {
    const data: EmployeeDto.ICreateEmployee = req.body;
    const user = await UserService.getUserByEmail(data.email);
    if (user) {
        throw createHttpError(409, "Employee With this email Alredy Exit.");
    }
    const userDoc = await UserService.createUserByAdmin({ firstName: data.firstName, lastName: data.lastName, email: data.email, role: data.role });
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
    if (data.email || data.firstName || data.lastName || data.role) {
        await UserService.updateUserByAdmin(empDoc.userId, {
            ...(data.firstName && { name: data.firstName }),
            ...(data.lastName && { name: data.lastName }),
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
    const empDoc = await EmployeeService.getEmployeeById(employeeId);
    if (!empDoc) {
        throw createHttpError(404, "Employee not found");
    }
    let address;
    if (empDoc.address) {
        address = await AddressService.saveAddress(data.address, empDoc.address._id);
    } else {
        address = await AddressService.saveAddress(data.address);
    }
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
    const result = await EmployeeService.updateEmployee(employeeId, { documents: data.documents, status: Enum.EmployeeStatus.ACTIVE })
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

export const deleteDraftEmployee = asyncHandler(async (req: Request, res: Response) => {
    const employeeId = req.params.employeeId;
    const employee = await EmployeeService.getEmployeeById(employeeId);
    if (!employee) {
        throw createHttpError(404, "Employee not found");
    }
    if (employee.status !== Enum.EmployeeStatus.DRAFT) {
        throw createHttpError(400, "Only draft employees can be deleted");
    }
    await EmployeeService.deleteDraftEmployee(employeeId);
    res.send(createResponse({}, "Employee deleted successfully"));
});
