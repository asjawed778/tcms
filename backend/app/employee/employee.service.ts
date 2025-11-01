import mongoose, { ClientSession } from "mongoose";
import * as EmployeeDto from "./employee.dto";
import facultySchema from "./employee.schema"
import * as Enum from "../common/utils/enum";
import * as UserService from "../user/user.service";
import employeeSchema from "./employee.schema";
import createHttpError from "http-errors";
import salaryStructureSchema from "./salaryStructure.schema";

// employee service functions
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

export const getAllEmployee = async (
    page = 1,
    limit = 10,
    search?: string,
    role?: string,
    gender?: string,
    status?: string
) => {
    const skip = (page - 1) * limit;
    const match: any = {};
    if (gender) match.gender = gender;
    if (status) match.status = status;

    const pipeline: any[] = [
        { $match: match },
        {
            $lookup: {
                from: "users",
                localField: "user",
                foreignField: "_id",
                as: "userDetails"
            }
        },
        { $unwind: "$userDetails" },
        {
            $lookup: {
                from: "roles",
                localField: "userDetails.role",
                foreignField: "_id",
                as: "roleDetails"
            }
        },
        { $unwind: "$roleDetails" },
    ];
    if (role) {
        pipeline.push({
            $match: {
                "roleDetails._id": new mongoose.Types.ObjectId(role)
            }
        });
    }

    if (search) {
        pipeline.push({
            $match: {
                $or: [
                    { "userDetails.name": { $regex: search, $options: "i" } },
                    { "userDetails.email": { $regex: search, $options: "i" } },
                    { employeeId: { $regex: search, $options: "i" } },
                    { phoneNumber: { $regex: search, $options: "i" } },
                    { designation: { $regex: search, $options: "i" } },
                    { qualification: { $regex: search, $options: "i" } },
                ]
            }
        });
    }

    pipeline.push(
        {
            $facet: {
                metadata: [{ $count: "total" }],
                data: [
                    { $skip: skip },
                    { $limit: limit },
                    {
                        $project: {
                            _id: 1,
                            employeeId: 1,
                            userId: "$userDetails._id",
                            roleId: "$roleDetails._id",
                            role: "$roleDetails.name",
                            name: "$userDetails.name",
                            email: "$userDetails.email",
                            gender: 1,
                            photo: 1,
                            status: 1,
                            dateOfJoining: 1,
                            designation: 1,
                            expertise: 1,
                        }
                    }
                ]
            }
        },
        {
            $project: {
                _id: 0,
                currentPage: page,
                limit,
                totalDocs: { $ifNull: [{ $arrayElemAt: ["$metadata.total", 0] }, 0] },
                showing: { $size: "$data" },
                employees: "$data"
            }
        }
    );
    const result = await employeeSchema.aggregate(pipeline);
    return result.length ? result[0] : { employees: [], totalDocs: 0, currentPage: page, limit };
};

export const getEmployeeById = async (id: string) => {
    const pipeline = [
        {
            $match: {
                _id: new mongoose.Types.ObjectId(id)
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "user",
                foreignField: "_id",
                as: "userDetails"
            }
        },
        { $unwind: "$userDetails" },
        {
            $lookup: {
                from: "roles",
                localField: "userDetails.role",
                foreignField: "_id",
                as: "roleDetails"
            }
        },
        { $unwind: { path: "$roleDetails", preserveNullAndEmptyArrays: true } },
        {
            $lookup: {
                from: "addresses",
                localField: "address",
                foreignField: "_id",
                as: "addressDetails"
            }
        },
        {
            $project: {
                _id: 1,
                employeeId: 1,
                status: 1,
                userId: "$userDetails._id",
                roleId: "$userDetails.role",
                roleName: "$roleDetails.name",
                name: "$userDetails.name",
                email: "$userDetails.email",
                phoneNumber: 1,
                gender: 1,
                dob: 1,
                photo: 1,
                aadhaarNumber: 1,
                fatherName: 1,
                motherName: 1,
                designation: 1,
                qualification: 1,
                certification: 1,
                expertise: 1,
                dateOfJoining: 1,
                experience: 1,
                documents: 1,
                address: { $arrayElemAt: ["$addressDetails", 0] },
                createdAt: 1,
                updatedAt: 1
            }
        }
    ];
    const result = await employeeSchema.aggregate(pipeline);
    return result.length ? result[0] : null;
};

export const getSalaryStructureByEmployeeId = async (employeeId: string) => {
    return await salaryStructureSchema.find({
        employee: new mongoose.Types.ObjectId(employeeId)
    }).sort({ effectiveFrom: -1 });
};















// old empl services






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

    // const assignedFacultyIds = await getAssignedFaculyIds(sessionId, day, startTime, endTime);

    // const result = await UserService.getUnassignedFaculty(assignedFacultyIds);
    return [];
};

