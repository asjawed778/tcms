import asyncHandler from "express-async-handler";
import * as UserService from "../user/user.service";
import { type Request, type Response } from "express";
import createHttpError from "http-errors";
import * as FacultyService from "./faculty.service";
import { createResponse } from "../common/helper/response.hepler";
import * as EmployeeService from "../employee/employee.service";
import * as AddressService from "../common/services/address.service";
import mongoose, { Types } from "mongoose";
import * as Enum from "../common/constant/enum";

export const createFaculty = asyncHandler(async (req: Request, res: Response) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const data = req.body;

        const user = await UserService.createUserByAdmin({ name: data.name, email: data.email, role: Enum.UserRole.FACULTY }, session);
        if (!user) {
            throw createHttpError(400, "User not created");
        }
        const address = await AddressService.saveAddress(data.addres)

        const employeeId: string = await EmployeeService.createEmployeeId(session);
        if (!employeeId) {
            throw createHttpError(400, "Employee not created");
        }

        const facultyData = {
            user: new Types.ObjectId(user._id),
            employeeId,
            fatherName: data.fatherName,
            motherName: data.motherName,
            designation: data.designation,
            expertiseSubjects: data.expertiseSubjects,
            qualification: data.qualification,
            certification: data.certification,
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

        throw createHttpError(500, "Faculty creation failed: " + error.message);
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

export const getFacultyById = asyncHandler(async (req: Request, res: Response) => {
    const {facultyId} = req.params;
    const faculty = await FacultyService.getFacultyById(facultyId);
    if (!faculty) {
        throw createHttpError(404, "Faculty not found");
    }
    res.send(createResponse(faculty, "Faculty fetched successfully"));
});

export const getUnassignedFaculty = asyncHandler(async (req: Request, res: Response) => {
    const { sessionId } = req.params;
    const {day, startTime, endTime} = req.body;

    const unassignedFaculty = await FacultyService.getUnassignedFaculty(new Types.ObjectId(sessionId), day, startTime, endTime);
    res.send(createResponse(unassignedFaculty, "Unassigned faculty fetched successfully"));
});