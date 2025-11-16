import createHttpError from "http-errors";
import * as StudentDto from "./student.dto";
import * as Enum from "../common/utils/enum";
import * as StudentUtils from "./student.utils";
import * as AddressService from "../common/services/address.service";
import * as AWSService from "../common/services/AWS.service";
import studentSchema from "./student.schema";
import admissionSchema from "./admission.schema";
import mongoose, { Types } from "mongoose";
import remarksSchema from "./remarks.schema";

export const addPersonalDetails = async (studentData: StudentDto.IAddStudentPersonalDetails) => {
    const registrationNumber = await StudentUtils.generateEnrollmentNumber();
    const data = { ...studentData, enrollmentNumber: registrationNumber };
    const student = new studentSchema(data);
    const result = await student.save();
    return result;
};

export const updateStudent = async (studentId: string, updateData: Partial<StudentDto.IStudent>) => {
    const student = await studentSchema.findByIdAndUpdate(studentId, updateData, { new: true });
    if (!student) {
        throw createHttpError(404, "Student not found");
    }
    return student;
};

export const addStudent = async (studentData: StudentDto.IStudentCreate) => {
    const student = await studentSchema.findOne({ adharNumber: studentData.adharNumber });
    if (student) {
        throw createHttpError(400, "Student with this Aadhar number already exists");
    }
    const newStudent = new studentSchema(studentData);
    const result = await newStudent.save();
    return result;
};

export const admissionStudentToClass = async (
    studentId: string,
    sessionId: string,
    classId: string,
    sectionId: string
) => {
    console.log("admissionStudentToClass", studentId, sessionId, classId, sectionId);
    const existingAdmission = await admissionSchema.findOne({
        student: studentId,
        session: sessionId,
    });
    console.log("existingAdmission", existingAdmission);

    if (existingAdmission) {
        existingAdmission.session = new Types.ObjectId(sessionId);
        existingAdmission.class = new Types.ObjectId(classId);
        existingAdmission.section = new Types.ObjectId(sectionId);
        existingAdmission.admissionStatus = Enum.AdmissionStatus.ACTIVE;

        await existingAdmission.save();
        return existingAdmission;
    }
    const newAdmission = new admissionSchema({
        student: studentId,
        session: sessionId,
        class: classId,
        section: sectionId,
    });
    const result = await newAdmission.save();
    return result;
};

export const getAdmissionByStudentId = async (studentId: string, sessionId: string) => {
    const admission = await admissionSchema.findOne({ student: studentId, session: sessionId });
    if (!admission) {
        throw createHttpError(404, "Admission not found");
    }
    return admission;
};

export const getDraftStudents = async (
    page: number = 1,
    limit: number = 10,
    search?: string,
    gender?: Enum.Gender,
    bloodGroup?: Enum.BloodGroup
) => {

    const skip = (page - 1) * limit;

    const studentQuery: any = {
        status: Enum.StudentStatus.DRAFT
    };

    if (search) {
        studentQuery.$or = [
            { firstName: { $regex: search, $options: "i" } },
            { lastName: { $regex: search, $options: "i" } },
            { enrollmentNumber: { $regex: search, $options: "i" } },
            { adharNumber: { $regex: search, $options: "i" } },
            { "father.name": { $regex: search, $options: "i" } },
            { "mother.name": { $regex: search, $options: "i" } },
            { contactNumber: { $regex: search, $options: "i" } }
        ];
    }

    if (gender) studentQuery.gender = gender;
    if (bloodGroup) studentQuery.bloodGroup = bloodGroup;

    const total = await studentSchema.countDocuments(studentQuery);

    const students = await studentSchema
        .find(studentQuery)
        .populate("address")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

    return {
        students,
        totalDocs: total,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
        hasNext: page < Math.ceil(total / limit),
        hasPrevious: page > 1,
        pageLimit: limit,
    };
};

export const getAllStudents = async (
    sessionId: string,
    page: number = 1,
    limit: number = 10,
    search?: string,
    classId?: string,
    sectionId?: string,
    gender?: Enum.Gender,
    admissionStatus?: Enum.AdmissionStatus,
    bloodGroup?: Enum.BloodGroup,
): Promise<StudentDto.IGetStudentResponse<any>> => {

    const skip = (page - 1) * limit;

    // Base admission query
    const admissionQuery: any = {};
    if (sessionId) admissionQuery.session = new Types.ObjectId(sessionId);
    if (classId) admissionQuery.class = new Types.ObjectId(classId);
    if (sectionId) admissionQuery.section = new Types.ObjectId(sectionId);
    if (admissionStatus) admissionQuery.admissionStatus = admissionStatus;

    // Student-level filters
    const studentFilters: any[] = [];

    if (search) {
        studentFilters.push({
            $or: [
                { 'student.firstName': { $regex: search, $options: 'i' } },
                { 'student.lastName': { $regex: search, $options: 'i' } },
                { 'student.enrollmentNumber': { $regex: search, $options: 'i' } },
                { 'student.adharNumber': { $regex: search, $options: 'i' } },
                { 'student.father.name': { $regex: search, $options: 'i' } },
                { 'student.mother.name': { $regex: search, $options: 'i' } },
                { 'student.contactNumber': { $regex: search, $options: 'i' } }
            ]
        });
    }

    if (gender) studentFilters.push({ 'student.gender': gender });
    if (bloodGroup) studentFilters.push({ 'student.bloodGroup': bloodGroup });

    // Construct full aggregation pipeline
    const pipeline: any[] = [
        { $match: admissionQuery },
        {
            $lookup: {
                from: "students",
                localField: "student",
                foreignField: "_id",
                as: "student"
            }
        },
        { $unwind: "$student" },
        ...(studentFilters.length > 0 ? [{ $match: { $and: studentFilters } }] : []),
        {
            $lookup: {
                from: "addresses",
                localField: "student.address",
                foreignField: "_id",
                as: "student.address"
            }
        },
        { $unwind: { path: "$student.address", preserveNullAndEmptyArrays: true } },
        {
            $lookup: {
                from: "classes",
                localField: "class",
                foreignField: "_id",
                as: "class"
            }
        },
        { $unwind: { path: "$class", preserveNullAndEmptyArrays: true } },
        {
            $lookup: {
                from: "sections",
                localField: "section",
                foreignField: "_id",
                as: "section"
            }
        },
        { $unwind: { path: "$section", preserveNullAndEmptyArrays: true } },
        {
            $lookup: {
                from: "sessions",
                localField: "session",
                foreignField: "_id",
                as: "session"
            }
        },
        { $unwind: { path: "$session", preserveNullAndEmptyArrays: true } },
        { $sort: { rollNumber: 1 } },
        {
            $facet: {
                metadata: [{ $count: "total" }],
                data: [
                    { $skip: skip },
                    { $limit: limit },
                    {
                        $project: {
                            _id: 0,
                            student: {
                                _id: "$student._id",
                                firstName: 1,
                                lastName: 1,
                                enrollmentNumber: 1,
                                adharNumber: 1,
                                photo: 1,
                                dob: 1,
                                gender: 1,
                                nationality: 1,
                                religion: 1,
                                motherTongue: 1,
                                bloodGroup: 1,
                                email: 1,
                                contactNumber: 1,
                                father: 1,
                                mother: 1,
                                localGuardian: 1,
                                previousSchool: 1,
                                address: 1,
                                documents: 1,
                                admissionYear: 1,
                                status: 1,
                            },
                            admission: {
                                _id: "$_id",
                                rollNumber: "$rollNumber",
                                admissionStatus: "$admissionStatus",
                                createdAt: "$createdAt",
                                updatedAt: "$updatedAt",
                                class: {
                                    _id: "$class._id",
                                    name: "$class.name"
                                },
                                section: {
                                    _id: "$section._id",
                                    name: "$section.name"
                                },
                                session: {
                                    _id: "$session._id",
                                    session: "$session.session"
                                }
                            }
                        }
                    }
                ]
            }
        }
    ];

    const [result] = await admissionSchema.aggregate(pipeline);
    const total = result?.metadata?.[0]?.total || 0;
    const students = result?.data || [];

    const totalPages = Math.ceil(total / limit);
    const hasNext = page < totalPages;
    const hasPrevious = page > 1;

    return {
        students,
        totalDocs: total,
        totalPages,
        currentPage: page,
        hasNext,
        hasPrevious,
        pageLimit: limit,
    };
};

export const getStudentById = async (studentId: string) => {
    const result = await studentSchema.aggregate([
        {
            $match: { _id: new Types.ObjectId(studentId) }
        },
        {
            $lookup: {
                from: "addresses",
                localField: "address",
                foreignField: "_id",
                as: "address"
            }
        },
        {
            $unwind: {
                path: "$address",
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $lookup: {
                from: "admissions",
                localField: "_id",
                foreignField: "student",
                as: "admissions"
            }
        },
        {
            $addFields: {
                initialAdmission: {
                    $arrayElemAt: [
                        {
                            $sortArray: {
                                input: "$admissions",
                                sortBy: { createdAt: 1 }
                            }
                        },
                        0
                    ]
                }
            }
        },
        {
            $lookup: {
                from: "sessions",
                localField: "initialAdmission.session",
                foreignField: "_id",
                as: "initialSession"
            }
        },
        {
            $unwind: {
                path: "$initialSession",
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $lookup: {
                from: "classes",
                localField: "initialAdmission.class",
                foreignField: "_id",
                as: "initialClass"
            }
        },
        {
            $unwind: {
                path: "$initialClass",
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $lookup: {
                from: "sections",
                localField: "initialAdmission.section",
                foreignField: "_id",
                as: "initialSection"
            }
        },
        {
            $unwind: {
                path: "$initialSection",
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $project: {
                enrollmentNumber: 1,
                firstName: 1,
                lastName: 1,
                dob: 1,
                gender: 1,
                nationality: 1,
                religion: 1,
                motherTongue: 1,
                adharNumber: 1,
                contactNumber: 1,
                email: 1,
                bloodGroup: 1,
                father: 1,
                mother: 1,
                localGuardian: 1,
                previousSchool: 1,
                documents: 1,
                address: 1,
                admissionYear: 1,
                status: 1,
                photo: 1,
                createdAt: 1,
                updatedAt: 1,
                admission: {
                    _id: "$initialAdmission._id",
                    rollNumber: "$initialAdmission.rollNumber",
                    admissionStatus: "$initialAdmission.admissionStatus",
                    createdAt: "$initialAdmission.createdAt",
                    updatedAt: "$initialAdmission.updatedAt",

                    session: {
                        _id: "$initialSession._id",
                        session: "$initialSession.session"
                    },
                    class: {
                        _id: "$initialClass._id",
                        name: "$initialClass.name"
                    },
                    section: {
                        _id: "$initialSection._id",
                        name: "$initialSection.name"
                    }
                }
            }
        }
    ]);
    return result[0] || null;
};

export const deleteDraftStudent = async (
    studentId: string,
    sessionId?: string,
    classId?: string,
    sectionId?: string
) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const student = await studentSchema.findById(studentId).session(session);
        if (!student) throw createHttpError(404, "Student not found");
        if (student.photo) {
            try {
                await AWSService.deleteObject(student.photo);
            } catch (err) {
                console.error("Failed to delete student photo:", err);
            }
        }
        if (student.documents && student.documents.length) {
            for (const doc of student.documents) {
                if (doc.url) {
                    try {
                        await AWSService.deleteObject(doc.url);
                    } catch (err) {
                        console.error("Failed to delete doc from S3:", err);
                    }
                }
            }
        }
        if (student.previousSchool) {
            const prev = student.previousSchool;
            if (prev.schoolLeavingCertificate?.url) {
                try {
                    await AWSService.deleteObject(prev.schoolLeavingCertificate.url);
                } catch (err) {
                    console.error("Failed to delete SLC:", err);
                }
            }
            if (prev.transferCertificate?.url) {
                try {
                    await AWSService.deleteObject(prev.transferCertificate.url);
                } catch (err) {
                    console.error("Failed to delete TC:", err);
                }
            }
        }

        if (student.address) {
            await AddressService.deleteAddressById(student.address.toString(), session);
        }

        const admissionDeleteFilter: any = { student: studentId };
        if (sessionId) admissionDeleteFilter.session = sessionId;
        if (classId) admissionDeleteFilter.class = classId;
        if (sectionId) admissionDeleteFilter.section = sectionId;

        await admissionSchema.deleteOne(admissionDeleteFilter).session(session);

        await studentSchema.deleteOne({ _id: studentId }).session(session);
        await session.commitTransaction();
        session.endSession();
        return true;
    } catch (err) {
        await session.abortTransaction();
        session.endSession();
        console.error("Delete Student Error:", err);
        throw err;
    }
};









// old student addition function






export const addRemark = async (remarkData: StudentDto.IRemarkCreate) => {
    const remark = new remarksSchema(remarkData);
    const result = await remark.save();
    return result;
};
