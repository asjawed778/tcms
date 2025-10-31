import mongoose, { ClientSession } from "mongoose";
import * as EmployeeDto from "./employee.dto";
import facultySchema from "./employee.schema"
import * as Enum from "../common/utils/enum";
import * as UserService from "../user/user.service";
import { getAssignedFaculyIds } from "../academics/academic.service";
import employeeSchema from "./employee.schema";
import createHttpError from "http-errors";
import salaryStructureSchema from "./salaryStructure.schema";


export const createEmployee = async (data: Partial<EmployeeDto.ICreateEmployee>) => {
    const result = await employeeSchema.create(data);
    if (!result) {
        throw createHttpError(500, "Something went wrong")
    }
    return result;
};

export const updateEmployee = async (employeeId: string, data: Partial<EmployeeDto.IEmployee>) => {
    const result = await employeeSchema.findByIdAndUpdate(employeeId, data, { new: true });
    if (!result) {
        throw createHttpError(404, "Employee not found");
    }
    return result;
};

export const upsertSalaryStructure = async (employeeId: string, data: Partial<EmployeeDto.ISalaryStructure>) => {
    const existing = await salaryStructureSchema.findOne({ employee: employeeId });
    if (existing) {
        const updated = await salaryStructureSchema.findByIdAndUpdate(
            existing._id,
            data,
            { new: true }
        );
        return updated;
    }
    const created = await salaryStructureSchema.create({
        employee: employeeId,
        ...data
    });
    return created;
};
















// old empl services
export const getAllFaculty = async (
    page = 1,
    limit = 10,
    search?: string
) => {
    const skip = (page - 1) * limit;
    const pipeline = [
        {
            $lookup: {
                from: "users",
                localField: "user",
                foreignField: "_id",
                as: "userDetails",
            },
        },
        {
            $unwind: "$userDetails",
        },
        {
            $lookup: {
                from: "addresses",
                localField: "address",
                foreignField: "_id",
                as: "addressDetails",
            }
        },
        {
            $unwind: { path: "$addressDetails", preserveNullAndEmptyArrays: true },
        },
        {
            $match: search ? {
                $or: [
                    { "userDetails.name": { $regex: search, $options: "i" } },
                    { "userDetails.email": { $regex: search, $options: "i" } },
                    { "phoneNumber": { $regex: search, $options: "i" } },
                    { "employeeId": { $regex: search, $options: "i" } },
                    { "designation": { $regex: search, $options: "i" } },
                    { "adharNumber": { $regex: search, $options: "i" } },
                    { "fatherName": { $regex: search, $options: "i" } },
                    { "motherName": { $regex: search, $options: "i" } },
                ]
            } : {}
        },
        {
            $facet: {
                metadata: [{ $count: "total" }],
                data: [
                    { $skip: skip },
                    { $limit: limit },
                    {
                        $project: {
                            _id: 1,
                            name: "$userDetails.name",
                            fatherName: 1,
                            motherName: 1,
                            email: "$userDetails.email",
                            phoneNumber: 1,
                            gender: 1,
                            dob: 1,
                            photo: 1,
                            aadhaarNumber: 1,
                            address: {
                                _id: "$addressDetails._id",
                                city: "$addressDetails.city",
                                state: "$addressDetails.state",
                                country: "$addressDetails.country",
                                pinCode: "$addressDetails.pinCode",
                                addressLine1: "$addressDetails.addressLine1",
                                addressLine2: "$addressDetails.addressLine2"
                            },
                            designation: 1,
                            dateOfJoining: 1,
                            expertiseSubjects: 1,
                            employeeId: 1,
                            qualification: 1,
                            salery: 1,
                            certification: 1,
                            status: 1,
                            documents: 1,
                        }
                    }
                ]
            }
        },
        {
            $project: {
                _id: 0,
                currentPage: { $literal: page },
                limit: { $literal: limit },
                totalDocuments: { $ifNull: [{ $arrayElemAt: ["$metadata.total", 0] }, 0] },
                showing: { $size: "$data" },
                faculty: "$data"
            }
        }
    ];

    const result = await facultySchema.aggregate(pipeline);
    return result.length > 0 ? result[0] : [];
};

export const getFacultyById = async (facultyId: string) => {

    const pipeline = [
        {
            $match: {
                _id: new mongoose.Types.ObjectId(facultyId)
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "user",
                foreignField: "_id",
                as: "userDetails",
            },
        },
        {
            $unwind: "$userDetails",
        },
        {
            $lookup: {
                from: "addresses",
                localField: "address",
                foreignField: "_id",
                as: "addressDetails",
            }
        },
        {
            $unwind: { path: "$addressDetails", preserveNullAndEmptyArrays: true },
        },
        {
            $project: {
                _id: 1,
                name: "$userDetails.name",
                fatherName: 1,
                motherName: 1,
                email: "$userDetails.email",
                phoneNumber: 1,
                gender: 1,
                dob: 1,
                photo: 1,
                aadhaarNumber: 1,
                address: {
                    _id: "$addressDetails._id",
                    city: "$addressDetails.city",
                    state: "$addressDetails.state",
                    country: "$addressDetails.country",
                    pinCode: "$addressDetails.pinCode",
                    addressLine1: "$addressDetails.addressLine1",
                    addressLine2: "$addressDetails.addressLine2"
                },
                designation: 1,
                dateOfJoining: 1,
                expertiseSubjects: 1,
                employeeId: 1,
                qualification: 1,
                salery: 1,
                certification: 1,
                status: 1,
                documents: 1,
            }
        }
    ];
    const result = await facultySchema.aggregate(pipeline);
    return result.length > 0 ? result[0] : null;
};

export const getUnassignedFaculty = async (
    sessionId: mongoose.Types.ObjectId,
    day: Enum.WeekDay,
    startTime: { hour: number; minute: number },
    endTime: { hour: number; minute: number }
) => {

    const assignedFacultyIds = await getAssignedFaculyIds(sessionId, day, startTime, endTime);

    const result = await UserService.getUnassignedFaculty(assignedFacultyIds);
    return result || [];
};

