import createHttpError from "http-errors";
import * as Enum from "../common/constant/enum";
import * as StudentDto from "./student.dto";
import studentSchema from "./student.schema";
import admissionSchema from "./admission.schema";
import mongoose, { Types } from "mongoose";
import remarksSchema from "./remarks.schema";

export const addStudent = async (studentData: StudentDto.IStudentCreate, session: mongoose.ClientSession) => {
    const student = await studentSchema.findOne({ adharNumber: studentData.adharNumber });
    if (student) {
        throw createHttpError(400, "Student with this Aadhar number already exists");
    }
    const newStudent = new studentSchema(studentData);
    const result = await newStudent.save({ session });
    return result;
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

export const getAdmissionByStudentId = async (studentId: string, sessionId: string) => {
    const admission = await admissionSchema.findOne({ student: studentId, session: sessionId });
    if (!admission) {
        throw createHttpError(404, "Admission not found");
    }
    return admission;
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

    const admissionQuery: any = {
        session: new Types.ObjectId(session),
        deleted: false,
    };

    if (standard) {
        admissionQuery.class = new Types.ObjectId(standard);
    }
    if (section) {
        admissionQuery.section = new Types.ObjectId(section);
    }

    let studentQuery: any = {};
    if (search) {
        studentQuery = {
            $or: [
                { 'student.name': { $regex: search, $options: 'i' } },
                { 'student.enrollmentNumber': { $regex: search, $options: 'i' } },
                { 'student.adharNumber': { $regex: search, $options: 'i' } },
                { 'student.father.name': { $regex: search, $options: 'i' } },
                { 'student.mother.name': { $regex: search, $options: 'i' } },
                { 'student.contactNumber': { $regex: search, $options: 'i' } }
            ]
        };
    }


    const totalAggResult = await admissionSchema.aggregate([
        { $match: admissionQuery },
        {
            $lookup: {
                from: 'students',
                localField: 'student',
                foreignField: '_id',
                as: 'student'
            }
        },
        { $unwind: '$student' },
        { $match: studentQuery },
        { $count: 'total' }
    ]);

    const total = totalAggResult.length > 0 ? totalAggResult[0].total : 0;

    const admissions = await admissionSchema.aggregate([
        { $match: admissionQuery },
        {
            $lookup: {
                from: 'students',
                localField: 'student',
                foreignField: '_id',
                as: 'student'
            }
        },
        { $unwind: '$student' },
        {
            $match: studentQuery
        },
        {
            $lookup: {
                from: 'addresses',
                localField: 'student.address',
                foreignField: '_id',
                as: 'student.address'
            }
        },
        { $unwind: { path: '$student.address', preserveNullAndEmptyArrays: true } },
        {
            $lookup: {
                from: 'classes',
                localField: 'class',
                foreignField: '_id',
                as: 'class'
            }
        },
        { $unwind: { path: '$class', preserveNullAndEmptyArrays: true } },
        {
            $lookup: {
                from: 'sections',
                localField: 'section',
                foreignField: '_id',
                as: 'section'
            }
        },
        { $unwind: { path: '$section', preserveNullAndEmptyArrays: true } },
        {
            $lookup: {
                from: 'sessions',
                localField: 'session',
                foreignField: '_id',
                as: 'session'
            }
        },
        { $unwind: { path: '$session', preserveNullAndEmptyArrays: true } },
        { $sort: { rollNumber: 1 } },
        { $skip: skip },
        { $limit: limit },
        {
            $project: {
                student: {
                    _id: '$student._id',
                    name: '$student.name',
                    enrollmentNumber: '$student.enrollmentNumber',
                    adharNumber: '$student.adharNumber',
                    image: '$student.image',
                    dob: '$student.dob',
                    gender: '$student.gender',
                    nationality: '$student.nationality',
                    religion: '$student.religion',
                    motherTongue: '$student.motherTongue',
                    bloodGroup: '$student.bloodGroup',
                    email: '$student.email',
                    contactNumber: '$student.contactNumber',
                    father: '$student.father',
                    mother: '$student.mother',
                    localGuardian: '$student.localGuardian',
                    previousSchool: '$student.previousSchool',
                    address: {
                        _id: '$student.address._id',
                        addressLine1: '$student.address.addressLine1',
                        addressLine2: '$student.address.addressLine2',
                        city: '$student.address.city',
                        state: '$student.address.state',
                        country: '$student.address.country',
                        pincode: '$student.address.pincode'
                    },
                    documents: '$student.documents',
                    admissionYear: '$student.admissionYear',
                    status: '$student.status',
                },
                admission: {
                    _id: '$_id',
                    session: {
                        _id: '$session._id',
                        session: '$session.session'
                    },
                    class: {
                        _id: '$class._id',
                        name: '$class.name'
                    },
                    section: {
                        _id: '$section._id',
                        name: '$section.name'
                    },
                    admissionStatus: '$admissionStatus',
                    deleted: '$deleted',
                    rollNumber: '$rollNumber',
                    createdAt: '$createdAt',
                    updatedAt: '$updatedAt'
                }
            }
        }
    ]);

    const filteredAdmissions = admissions.map(admission => ({
        student: admission.student,
        admission: admission.admission
    }));

    const totalPages = Math.ceil(total / limit);
    const hasNext = page < totalPages;
    const hasPrevious = page > 1;

    return {
        students: filteredAdmissions,
        totalDocs: total,
        totalPages,
        currentPage: page,
        hasNext,
        hasPrevious,
        pageLimit: limit,
    };
};

export const getStudentById = async (studentId: string) => {
    const student = await studentSchema.findById(studentId)
        .populate({
            path: 'address',
            select: 'addressLine1 addressLine2 city state country pincode'
        })

    return student;
};

export const addRemark = async (remarkData: StudentDto.IRemarkCreate) => {
    const remark = new remarksSchema(remarkData);
    const result = await remark.save();
    return result;
};
