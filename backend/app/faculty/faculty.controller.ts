import asyncHandler from "express-async-handler";
import * as UserService from "../user/user.service";
import { type Request, type Response } from "express";
import createHttpError from "http-errors";
import * as FacultyService from "./faculty.service";
import { createResponse } from "../common/helper/response.hepler";
import { UserRole } from "../user/user.schema";
import * as EmployeeService from "../employee/employee.service";
import * as AddressService from "../common/services/address.service";
import { ICreateEmployee } from "../employee/employee.dto";
import mongoose, { Types } from "mongoose";

export const createFaculty = asyncHandler(async (req: Request, res: Response) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const data = req.body;

        const user = await UserService.createUserByAdmin({ name: data.name, email: data.email, role: UserRole.FACULTY, profilePic: data.photo }, session);
        if (!user) {
            throw createHttpError(400, "User not created");
        }
        const address = await AddressService.createAddress(data.address, session)
        const empData = {
            userId: user._id as string,
            name: data.name,
            email: data.email,
            phoneNumber: data.phoneNumber,
            gender: data.gender,
            dob: data.dob,
            aadhaarNumber: data.aadhaarNumber,
            dateOfJoining: data.dateOfJoining,
            photo: data.photo,
            address: new Types.ObjectId(address._id),
            experience: data.experience || [],
            salary: data.salary,
            documents: data.documents,
            isActive: true,
        };
        const employee = await EmployeeService.createEmployee(empData as ICreateEmployee, session);
        if (!employee) {
            throw createHttpError(400, "Employee not created");
        }

        const facultyData = {
            userId: new Types.ObjectId(user._id),
            employeeId: employee.employeeId,
            name: data.name,
            fatherName: data.fatherName,
            motherName: data.motherName,
            email: data.email,
            phoneNumber: data.phoneNumber,
            designation: data.designation,
            expertiseSubjects: data.expertiseSubjects,
            qualification: data.qualification,
            certification: data.certification,
            status: data.status,
        }

        const faculty = await FacultyService.createFaculty(facultyData, session)

        if (!faculty) {
            throw createHttpError(400, "Faculty not created");
        }

        await session.commitTransaction();
        session.endSession();

        res.send(createResponse(faculty, "Faculty created successfully"));
    } catch (error: any) {
        await session.abortTransaction();
        session.endSession();

        throw createHttpError(500, "Faculty creation failed: " + error.message); // let
    }

});

export const getAllFaculty = asyncHandler(async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = req.query.search as string || "";
    const faculty = await FacultyService.getAllFaculty(page, limit, search);
    if (!faculty) {
        throw createHttpError(404, "Faculty not found");
    }
    res.send(createResponse(faculty, "Faculty fetched successfully"));
});