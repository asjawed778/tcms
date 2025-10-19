import mongoose, { ClientSession } from "mongoose";
import * as FacultyDTO from "./faculty.dto";
import facultySchema from "./faculty.schema"
import * as Enum from "../common/utils/enum";
import * as UserService from "../user/user.service";
import { getAssignedFaculyIds } from "../class/class.service";

export const createFaculty = async (data: FacultyDTO.ICreateFaculty, session?: ClientSession) => {
    const [result] = await facultySchema.create([data], { session });
    return result as FacultyDTO.IFaculty;
};

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

