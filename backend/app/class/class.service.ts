import * as ClassDto from "./class.dto";
import subjectSchema from "./subject.schema";
import classSchema from "./class.schema";
import createHttpError from "http-errors";
import sectionSchema from "./section.schema";
import classTimetableSchema from "./class.timetable.schema";

export const isClassAlreadyExists = async (name: string, session: string) => {
    const existingClass = await classSchema.findOne({ name, session, deleted: false });
    return !!existingClass;
};

export const isClassAndSectionValid = async (sessionId: string, classId: string, sectionId?: string) => {
    const result = await classSchema.findOne({ _id: classId, session: sessionId, deleted: false });
    if (!result) {
        return false;
    }
    if (sectionId) {
        const section = result.sections.find((sec) => {
            return sec.toString() === sectionId
        });
        return !!section;
    }
    return true;
};

export const assignFaculty = async (sectionId: string, facultyId: string) => {
    const section = await sectionSchema.findById(sectionId);

    if (!section) {
        throw createHttpError(404, "Section not found");
    }

    if (section.classTeacher && section.classTeacher.toString() === facultyId) {
        throw createHttpError(400, "This faculty is already assigned to this Class - section");
    }

    if (section.classTeacher) {
        throw createHttpError(400, "This section already has an assigned faculty");
    }
    const result = await sectionSchema.findByIdAndUpdate(
        sectionId,
        { classTeacher: facultyId },
        { new: true }
    );

    return result;
};

export const removeAssignedTeacher = async (sectionId: string) => {
    const section = await sectionSchema.findById(sectionId);

    if (!section) {
        throw createHttpError(404, "Section not found");
    }
    if (!section.classTeacher) {
        throw createHttpError(400, "This section doesn't have an assigned teacher");
    }
    const result = await sectionSchema.findByIdAndUpdate(
        sectionId,
        { $unset: { classTeacher: 1 } },
        { new: true }
    );

    return result;
};

export const createClass = async (data: ClassDto.ICreateClass) => {
    const { subjects: subjectInputs = [], sections: sectionInputs = [], ...classData } = data;

    let subjectIds: string[] = [];
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
            select: "-__v -deleted",
            match: { deleted: false }
        })
        .populate({
            path: "subjects",
            select: "-__v -deleted",
            match: { deleted: false }
        })
        .populate({
            path: "sections",
            select: "-__v -deleted",
            populate: {
                path: "classTeacher",
                select: "_id employeeId name designation status",
            },
            match: { deleted: false },
        })
        .lean();

    if (!classes) {
        throw createHttpError(404, "No classes found for this session invalid sessionId");
    }

    if (classes.length === 0) {
        return [];
    }


    return { classes };
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

export const createTimeTable = async (timeTableData: ClassDto.ICreateTimeTable) => {
    const { session, section, class: classId, weeklySchedule } = timeTableData;

    const existingTimeTable = await classTimetableSchema.findOne({ session, section, class: classId });
    if (existingTimeTable) {
        throw createHttpError(400, "Time table already exists for this class and section");
    }

    const newTimeTable = await classTimetableSchema.create({
        session,
        section,
        class: classId,
        weeklySchedule
    });

    if (!newTimeTable) {
        throw createHttpError(500, "Failed to create time table");
    }

    return newTimeTable;
}

