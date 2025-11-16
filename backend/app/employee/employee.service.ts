import mongoose from "mongoose";
import * as EmployeeDto from "./employee.dto";
import * as Enum from "../common/utils/enum";
import * as AWSService from "../common/services/AWS.service";
import * as AddressService from "../common/services/address.service";
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
                    { "userDetails.firstName": { $regex: search, $options: "i" } },
                    { "userDetails.lastName": { $regex: search, $options: "i" } },
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
                            firstName: "$userDetails.firstName",
                            lastName: "$userDetails.lastName",
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
                firstName: "$userDetails.firstName",
                lastName: "$userDetails.lastName",
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

export const getEmployeeAddress = async (employeeId: string) => {
    const empDoc = await employeeSchema.findById(employeeId);
    if (!empDoc) {
        throw createHttpError(404, "Employee Not found");
    }
    if (!empDoc.address) {
        throw createHttpError(404, "Address not found for employee");
    }
    const addressId = typeof empDoc.address === "string" ? empDoc.address : empDoc.address.toString();
    const addressDoc = await AddressService.getAddressById(addressId);
    return addressDoc;
};

export const deleteDraftEmployee = async (employeeId: string) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const employee = await employeeSchema.findById(employeeId).session(session);

        if (!employee) throw createHttpError(404, "Employee not found");
        if (employee.photo) {
            try {
                await AWSService.deleteObject(employee.photo);
            } catch (err) {
                console.error("Failed to delete employee photo:", err);
            }
        }
        if (employee.documents?.length) {
            for (const doc of employee.documents) {
                if (doc.url) {
                    try {
                        await AWSService.deleteObject(doc.url);
                    } catch (err) {
                        console.error("Failed to delete employee document:", err);
                    }
                }
            }
        }

        if (employee.address) {
            await AddressService.deleteAddressById(employee.address.toString(), session);
        }

        if (employee.user) {
            await UserService.deleteUserById(employee.user.toString(), session);
        }

        await employeeSchema.deleteOne({ _id: employeeId }).session(session);

        await session.commitTransaction();
        session.endSession();
        return true;

    } catch (err) {
        await session.abortTransaction();
        session.endSession();
        console.error("Delete Employee Error:", err);
        throw err;
    }
};
















// old empl services

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

