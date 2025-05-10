import { ICreateClass } from "./class.dto";
import subjectSchema from "./subject.schema";
import classSchema from "./class.schema";
import createHttpError from "http-errors";
import sectionSchema from "./section.schema";

export const isClassAlreadyExists = async (name: string, session: string) => {
    const existingClass = await classSchema.findOne({ name, session, deleted: false });
    return !!existingClass;
};

export const createClass = async (data: ICreateClass) => {
    const { subjects: subjectInputs = [], sections: sectionInputs = [], ...classData } = data;

    let subjectIds:string[] = [];
    if (subjectInputs.length > 0) {
        const createdSubjects = await subjectSchema.insertMany(subjectInputs);
        if (!createdSubjects || createdSubjects.length !== subjectInputs.length) {
            throw createHttpError(400, "Failed to create some or all subjects");
        }
        subjectIds = createdSubjects.map((subject) => subject._id);
    }

    const createdSections = await sectionSchema.insertMany(sectionInputs);
    if (!createdSections || createdSections.length !== sectionInputs.length) {
        throw createHttpError(500, "Failed to create some or all sections");
    }
    const sectionIds = createdSections.map((section) => section._id);

    const newClass = await classSchema.create({
        ...classData,
        subjects: subjectIds,
        sections: sectionIds
    });

    if (!newClass) {
        throw createHttpError(500, "Failed to create class");
    }

    return newClass;
};

export const getAllClass = async (sessionId: string) => {
    const classes = await classSchema.find({ session: sessionId })
        .populate({
            path: "session",
            select: "_id session",
            match: { deleted: false }
        })
        .populate({
            path: "subjects",
            select: "_id",
            match: { deleted: false }
        })
        .populate({
            path: "sections",
            select: "_id name",
            match: { deleted: false },
        })
        .lean();

    if (!classes) {
        throw createHttpError(404, "No classes found for this session invalid sessionId");
    }

    if (classes.length === 0) {
        return [];
    }
    const simplifiedClasses = classes.map(cls => ({
        _id: cls._id,
        name: cls.name,
        session: cls.session,
        courseStream: cls.courseStream,
        feeStructure: cls.feeStructure,
        subjectsCount: cls.subjects?.length || 0,
        sectionsCount: cls.sections?.length || 0
    }));

    return simplifiedClasses;
};

export const getClassById = async (classId: string) => {
    const result = await classSchema.findById(classId)
        .populate({
            path: "session",
            select: "_id session", 
            match: { deleted: false }
        })
        .populate({
            path: "subjects",
            match: { deleted: false },
            select: "-__v"
        })
        .populate({
            path: "sections",
            populate: {
                path: "classTeacher",
                select: "_id employeeId name designation status",
                populate: {
                    path: "userId",
                    select: "profilePic"
                }
            }
        })
        .lean();

    console.log("result: ", result);

    // if (!result) {
    //     throw createHttpError(404, "Class not found");
    // }
    
    return result;
};