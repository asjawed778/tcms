import mongoose, { ClientSession } from "mongoose";
import * as FacultyDTO from "./faculty.dto";
import facultySchema from "./faculty.schema"
import * as Enum from "../common/constant/enum";
import { getTimeTableByDay } from "../class/class.service";

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
                from: "employees",
                localField: "user",
                foreignField: "user",
                as: "employeeDetails",
            },
        },
        {
            $unwind: { path: "$employeeDetails", preserveNullAndEmptyArrays: true },
        },
        {
            $lookup: {
                from: "addresses",
                localField: "employeeDetails.address",
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
                    { "employeeDetails.phoneNumber": { $regex: search, $options: "i" } },
                    { "employeeDetails.employeeId": { $regex: search, $options: "i" } },
                    { "designation": { $regex: search, $options: "i" } }
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
                            phoneNumber: "$employeeDetails.phoneNumber",
                            gender: "$employeeDetails.gender",
                            dob: "$employeeDetails.dob",
                            photo: "$employeeDetails.photo",
                            aadhaarNumber: "$employeeDetails.aadhaarNumber",
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
                            dateOfJoining: "$employeeDetails.dateOfJoining",
                            expertiseSubjects: 1,
                            employeeId: "$employeeDetails.employeeId",
                            qualification: 1,
                            salery: "$employeeDetails.salary",
                            certification: 1,
                            status: 1,
                            documents: "$employeeDetails.documents",
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
                from: "employees",
                localField: "user",
                foreignField: "user",
                as: "employeeDetails",
            },
        },
        {
            $unwind: { path: "$employeeDetails", preserveNullAndEmptyArrays: true },
        },
        {
            $lookup: {
                from: "addresses",
                localField: "employeeDetails.address",
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
                phoneNumber: "$employeeDetails.phoneNumber",
                gender: "$employeeDetails.gender",
                dob: "$employeeDetails.dob",
                photo: "$employeeDetails.photo",
                aadhaarNumber: "$employeeDetails.aadhaarNumber",
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
                dateOfJoining: "$employeeDetails.dateOfJoining",
                expertiseSubjects: 1,
                employeeId: "$employeeDetails.employeeId",
                qualification: 1,
                salery: "$employeeDetails.salary",
                certification: 1,
                status: 1,
                documents: "$employeeDetails.documents",
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
    const startTotalMinutes = startTime.hour * 60 + startTime.minute;
    const endTotalMinutes = endTime.hour * 60 + endTime.minute;

    const timeTables = await getTimeTableByDay(sessionId, day);

    const assignedFacultyIds = new Set<string>();

    timeTables.forEach((timetable) => {
        timetable.weeklySchedule.forEach((schedule) => {
            if (schedule.day !== day) return;

            schedule.periods?.forEach((period) => {
                if (!period.faculty || !period.timeSlot) return;

                const periodStart = period.timeSlot.start.hour * 60 + period.timeSlot.start.minute;
                const periodEnd = period.timeSlot.end.hour * 60 + period.timeSlot.end.minute;

                const buffer = 5;
                const isOverlap = (startTotalMinutes - buffer) < periodEnd && periodStart < (endTotalMinutes + buffer);

                if (isOverlap && period.faculty) {
                    assignedFacultyIds.add(String(period.faculty));
                }
            });
        });
    });

    const pipeline = [
        {
            $match: {
                _id: { $nin: Array.from(assignedFacultyIds).map(id => new mongoose.Types.ObjectId(id)) }
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
            $project: {
                _id: 1,
                name: "$userDetails.name",
                designation: 1
            }
        }
    ]

    const unassignedFaculty = await facultySchema.aggregate(pipeline);

    return unassignedFaculty.length > 0 ? unassignedFaculty[0] : [];
};

