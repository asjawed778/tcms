import { ClientSession } from "mongoose";
import * as FacultyDTO from "./faculty.dto";
import facultySchema from "./faculty.schema"

export const createFaculty = async (data: FacultyDTO.ICreateFaculty, session?: ClientSession) => {
    const [result] = await facultySchema.create([data], { session });
    return result as FacultyDTO.IFaculty;
};

export const getAllFaculty = async (
    page = 1,
    limit = 10,
    search?: string
) => {
    const query: any = {};

    if (search) {
        query.$or = [
            { name: { $regex: search, $options: "i" } },
            { employeeId: { $regex: search, $options: "i" } },
        ];
    }

    const totalDocuments = await facultySchema.countDocuments(query);
    const faculty = await facultySchema
        .find(query)
        .skip((page - 1) * limit)
        .limit(limit)
        .lean();

    return {
        currentPage: page,
        limit,
        totalDocuments,
        showing: faculty.length,
        faculty,
    };
};

export const getFacultyById = async (facultyId: string) => {
    const faculty = await facultySchema.findById(facultyId).lean();
    if (!faculty) {
        return null;
    }
    return faculty;
}
