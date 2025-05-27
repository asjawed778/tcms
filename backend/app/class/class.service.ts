import * as ClassDto from "./class.dto";
import subjectSchema from "./subject.schema";
import classSchema from "./class.schema";
import createHttpError from "http-errors";
import sectionSchema from "./section.schema";
import classTimetableSchema from "./class.timetable.schema";
import * as Enum from "../common/constant/enum";
import mongoose from "mongoose";

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
                select: "_id designation status",
                populate: {
                    path: "user",
                    select: "_id name",
                    transform: (doc) => {
                        if (doc) {
                            return {
                                _id: doc._id,
                                name: doc.name
                            };
                        }
                        return doc;
                    }
                }
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

export const getTimeTableByDay = async (sessionId: mongoose.Types.ObjectId, day: Enum.WeekDay) => {
    const timeTable = await classTimetableSchema.find({
        session: sessionId,
        "weeklySchedule.day": day,
        "weeklySchedule.periods": {
            $elemMatch: {
                "timeSlot.start.hour": { $exists: true },
                "timeSlot.start.minute": { $exists: true },
                "timeSlot.end.hour": { $exists: true },
                "timeSlot.end.minute": { $exists: true },
                faculty: { $ne: null }
            }
        }
    });
    return timeTable;
}

export const getTimeTableofClassById = async (timeTableId: string) => {
    const timeTable = await classTimetableSchema.findById(timeTableId)

    return timeTable;
}

// export const getTimeTableBySectionId = async (sessionId: string, sectionId: string, classId: string) => {

//     const pipeline = [
//         {
//             $match: {
//                 session: new mongoose.Types.ObjectId(sessionId),
//                 section: new mongoose.Types.ObjectId(sectionId),
//                 class: new mongoose.Types.ObjectId(classId)
//             },
//         },
//         {
//             $lookup: {
//                 from: "sessions",
//                 localField: "session",
//                 foreignField: "_id",
//                 as: "session",
//                 pipeline: [
//                     { $match: { deleted: false } },
//                     { $project: { session: 1 } }
//                 ]
//             }
//         },
//         { $unwind: "$session" },
//         {
//             $lookup: {
//                 from: "classes",
//                 localField: "class",
//                 foreignField: "_id",
//                 as: "class",
//                 pipeline: [
//                     { $match: { deleted: false } },
//                     { $project: { name: 1 } }
//                 ]
//             }
//         },
//         { $unwind: "$class" },
//         {
//             $lookup: {
//                 from: "sections",
//                 localField: "section",
//                 foreignField: "_id",
//                 as: "section",
//                 pipeline: [
//                     { $match: { deleted: false } },
//                     { $project: { name: 1 } }
//                 ]
//             }
//         },
//         { $unwind: "$section" },
//         { $unwind: "$weeklySchedule" },
//         { $unwind: "$weeklySchedule.periods" },
//         {
//             $lookup: {
//                 from: "subjects",
//                 localField: "weeklySchedule.periods.subject",
//                 foreignField: "_id",
//                 as: "subject"
//             }
//         },
//         { $unwind: { path: "$subject", preserveNullAndEmptyArrays: true } },
//         {
//             $lookup: {
//                 from: "faculties",
//                 localField: "weeklySchedule.periods.faculty",
//                 foreignField: "_id",
//                 as: "faculty"
//             }
//         },
//         { $unwind: { path: "$faculty", preserveNullAndEmptyArrays: true } },
//         // {
//         //     $lookup: {
//         //         from: "users",
//         //         localField: "faculty.user",
//         //         foreignField: "_id",
//         //         as: "facultyUser"
//         //     }
//         // },
//         // { $unwind: { path: "$facultyUser", preserveNullAndEmptyArrays: true } },
//         {
//             $group: {
//                 _id: {
//                     _id: "$_id",
//                     day: "$weeklySchedule.day",
//                     isHoliday: "$weeklySchedule.isHoliday",
//                     holidayReason: "$weeklySchedule.holidayReason"
//                 },
//                 periods: {
//                     $push: {
//                         periodType: "$weeklySchedule.periods.periodType",
//                         periodNumber: "$weeklySchedule.periods.periodNumber",
//                         subject: "$subject",
//                         faculty: "$faculty",
//                         room: "$weeklySchedule.periods.room",
//                         timeSlot: "$weeklySchedule.periods.timeSlot"
//                     }
//                 },
//                 session: { $first: "$session.session" },
//                 class: { $first: "$class.name" },
//                 section: { $first: "$section.name" }
//             }
//         },
//         {
//             $project: {
//                 _id: "$_id._id",
//                 session: 1,
//                 class: 1,
//                 section: 1,
//                 weeklySchedule: {
//                     day: "$_id.day",
//                     isHoliday: "$_id.isHoliday",
//                     holidayReason: "$_id.holidayReason",
//                     periods: "$periods"
//                 }
//             }
//         },
//         {
//             $group: {
//                 _id: "$_id",
//                 session: { $first: "$session" },
//                 class: { $first: "$class" },
//                 section: { $first: "$section" },
//                 weeklySchedule: { $push: "$weeklySchedule" }
//             }
//         }
//     ];

//     const result = await classTimetableSchema.aggregate(pipeline);

//     return result.length > 0 ? result[0] : null;
// }

export const getTimeTableBySectionId = async (sessionId: string, sectionId: string, classId: string) => {
    const pipeline: mongoose.PipelineStage[] = [
        {
            $match: {
                session: new mongoose.Types.ObjectId(sessionId),
                section: new mongoose.Types.ObjectId(sectionId),
                class: new mongoose.Types.ObjectId(classId)
            }
        },
        {
            $lookup: {
                from: "sessions",
                localField: "session",
                foreignField: "_id",
                as: "session",
                pipeline: [
                    { $match: { deleted: false } },
                    { $project: { session: 1 } }
                ]
            }
        },
        { $unwind: "$session" },
        {
            $lookup: {
                from: "classes",
                localField: "class",
                foreignField: "_id",
                as: "class",
                pipeline: [
                    { $match: { deleted: false } },
                    { $project: { name: 1 } }
                ]
            }
        },
        { $unwind: "$class" },
        {
            $lookup: {
                from: "sections",
                localField: "section",
                foreignField: "_id",
                as: "section",
                pipeline: [
                    { $match: { deleted: false } },
                    { $project: { name: 1 } }
                ]
            }
        },
        { $unwind: "$section" },
        { $unwind: "$weeklySchedule" },
        { $unwind: "$weeklySchedule.periods" },
        {
            $lookup: {
                from: "subjects",
                localField: "weeklySchedule.periods.subject",
                foreignField: "_id",
                as: "subject"
            }
        },
        { $unwind: { path: "$subject", preserveNullAndEmptyArrays: true } },
        {
            $lookup: {
                from: "faculties",
                localField: "weeklySchedule.periods.faculty",
                foreignField: "_id",
                as: "faculty",
                pipeline: [
                    {
                        $lookup: {
                            from: "users",
                            localField: "user",
                            foreignField: "_id",
                            as: "user"
                        }
                    },
                    { $unwind: { path: "$user", preserveNullAndEmptyArrays: true } },
                    { $project: { _id: 1, user: { name: 1 } } }
                ]
            }
        },
        { $unwind: { path: "$faculty", preserveNullAndEmptyArrays: true } },
        {
            $sort: {
                "weeklySchedule.day": 1,
                "weeklySchedule.periods.periodNumber": 1
            }
        },
        {
            $group: {
                _id: {
                    _id: "$_id",
                    day: "$weeklySchedule.day",
                    isHoliday: "$weeklySchedule.isHoliday",
                    holidayReason: "$weeklySchedule.holidayReason"
                },
                periods: {
                    $push: {
                        periodType: "$weeklySchedule.periods.periodType",
                        periodNumber: "$weeklySchedule.periods.periodNumber",
                        subject: "$subject",
                        faculty: {
                            $cond: {
                                if: { $ifNull: ["$faculty", false] },
                                then: {
                                    _id: "$faculty._id",
                                    name: "$faculty.user.name"
                                },
                                else: null
                            }
                        },
                        room: "$weeklySchedule.periods.room",
                        timeSlot: "$weeklySchedule.periods.timeSlot"
                    }
                },
                session: { $first: "$session.session" },
                class: { $first: "$class.name" },
                section: { $first: "$section.name" }
            }
        },
        {
            $addFields: {
                periods: {
                    $sortArray: {
                        input: "$periods",
                        sortBy: { periodNumber: 1 }
                    }
                }
            }
        },
        {
            $project: {
                _id: "$_id._id",
                session: 1,
                class: 1,
                section: 1,
                weeklySchedule: {
                    day: "$_id.day",
                    isHoliday: "$_id.isHoliday",
                    holidayReason: "$_id.holidayReason",
                    periods: "$periods"
                },
                dayOrder: {
                    $switch: {
                        branches: [
                            { case: { $eq: ["$_id.day", "Monday"] }, then: 1 },
                            { case: { $eq: ["$_id.day", "Tuesday"] }, then: 2 },
                            { case: { $eq: ["$_id.day", "Wednesday"] }, then: 3 },
                            { case: { $eq: ["$_id.day", "Thursday"] }, then: 4 },
                            { case: { $eq: ["$_id.day", "Friday"] }, then: 5 },
                            { case: { $eq: ["$_id.day", "Saturday"] }, then: 6 },
                            { case: { $eq: ["$_id.day", "Sunday"] }, then: 7 }
                        ],
                        default: 8
                    }
                }
            }
        },
        { $sort: { dayOrder: 1 } },
        {
            $group: {
                _id: "$_id",
                session: { $first: "$session" },
                class: { $first: "$class" },
                section: { $first: "$section" },
                weeklySchedule: { $push: "$weeklySchedule" }
            }
        }
    ];

    const result = await classTimetableSchema.aggregate(pipeline);
    return result.length > 0 ? result[0] : null;
};