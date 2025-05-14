import createHttpError from "http-errors";
import * as Enum from "../common/constant/enum";
import * as StudentDto from "./student.dto";
import studentSchema from "./student.schema";
import admissionSchema from "./admission.schema";
import mongoose from "mongoose";

export const addStudent = async (studentData: StudentDto.IStudentCreate, session: mongoose.ClientSession) => {
    const student = await studentSchema.findOne({ adharNumber: studentData.adharNumber });
    if (student) {
        throw createHttpError(400, "Student with this Aadhar number already exists");
    }
    const newStudent = new studentSchema(studentData);
    await newStudent.save({ session });
    return newStudent;
};

export const admissionStudentToClass = async (studentId: string, sessionId: string, classId: string, sectionId: string, session: mongoose.ClientSession) => {
    const admission = await admissionSchema.create([{
        student: studentId,
        class: classId,
        section: sectionId,
        session: sessionId,
    }], { session });
    return admission[0];
};

export const getStudents = async (
    session: string,
    page: number = 1,
    limit: number = 10,
    search?: string,
    standard?: string,
    section?: string
): Promise<StudentDto.IGetStudentResponse<any>> => {

    const skip = (page - 1) * limit;

    // Build the base query for admissions
    const admissionQuery: any = {
        session,
        deleted: false,
        admissionStatus: 'ACTIVE'
    };

    // Add optional filters
    if (standard) {
        admissionQuery.class = standard;
    }
    if (section) {
        admissionQuery.section = section;
    }

    // Build the student query if search term is provided
    let studentQuery: any = {};
    if (search) {
        studentQuery = {
            $or: [
                { name: { $regex: search, $options: 'i' } },
                { enrollmentNumber: { $regex: search, $options: 'i' } },
                { adharNumber: { $regex: search, $options: 'i' } },
                { 'father.name': { $regex: search, $options: 'i' } },
                { 'mother.name': { $regex: search, $options: 'i' } },
                { contactNumber: { $regex: search, $options: 'i' } }
            ]
        };
    }

    // Get total count of matching records for pagination info
    const total = await admissionSchema.countDocuments(admissionQuery)
        .where('student')
        .populate({
            path: 'student',
            match: studentQuery
        });

    // Get the actual data with joins
    const admissions = await admissionSchema.find(admissionQuery)
        .populate({
            path: 'student',
            match: studentQuery,
            select: '-__v -createdAt -updatedAt'
        })
        .populate('class', 'name')
        .populate('section', 'name')
        .populate('session', 'name')
        .skip(skip)
        .limit(limit)
        .sort({ rollNumber: 1 })
        .lean();

    // Filter out admissions where student is null (due to search not matching)
    const filteredAdmissions = admissions.filter(admission => admission.student);

    // Calculate pagination metadata
    const totalPages = Math.ceil(total / limit);
    const hasNext = page < totalPages;
    const hasPrevious = page > 1;

    return {
        data: filteredAdmissions,
        pagination: {
            totalDocs: total,
            totalPages,
            currentPage: page,
            hasNext,
            hasPrevious,
            limit
        }
    };
};
