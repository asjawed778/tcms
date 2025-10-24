import { body, param, query } from 'express-validator';
import * as Enum from '../common/utils/enum';
import mongoose from 'mongoose';

// subject validation
export const createSubject = [
    body("name")
        .notEmpty().withMessage("Subject name is required")
        .isString().withMessage("Subject name must be a string"),

    body("sessionId")
        .notEmpty().withMessage("Session ID is required")
        .isMongoId().withMessage("Session ID must be a valid Mongo ID"),
    body("publication")
        .optional()
        .isString().withMessage("Publication must be a string"),

    body("writer")
        .optional()
        .isString().withMessage("Writer must be a string"),

    body("ISBN")
        .optional()
        .isString().withMessage("ISBN must be a string"),

    body("subjectType")
        .notEmpty().withMessage("Subject type is required")
        .isIn(Object.values(Enum.SubjectType))
        .withMessage(`Subject type must be one of: ${Object.values(Enum.SubjectType).join(", ")}`),

    body("subjectCategory")
        .notEmpty().withMessage("Subject category is required")
        .isIn(Object.values(Enum.SubjectCategory))
        .withMessage(`Subject category must be one of: ${Object.values(Enum.SubjectCategory).join(", ")}`),

    body("syllabus")
        .optional()
        .isString().withMessage("Syllabus must be a string"),
];

export const createSubjectBulk = [
    body("subjects")
        .isArray({ min: 1 })
        .withMessage("Subjects must be a non-empty array"),

    body("subjects.*.name")
        .notEmpty()
        .withMessage("Subject name is required")
        .isString()
        .withMessage("Subject name must be a string"),

    body("subjects.*.sessionId")
        .notEmpty()
        .withMessage("Session ID is required")
        .isMongoId()
        .withMessage("Session ID must be a valid Mongo ID"),

    body("subjects.*.publication")
        .optional()
        .isString()
        .withMessage("Publication must be a string"),

    body("subjects.*.writer")
        .optional()
        .isString()
        .withMessage("Writer must be a string"),

    body("subjects.*.ISBN")
        .optional()
        .isString()
        .withMessage("ISBN must be a string"),

    body("subjects.*.subjectType")
        .notEmpty()
        .withMessage("Subject type is required")
        .isIn(Object.values(Enum.SubjectType))
        .withMessage(
            `Subject type must be one of: ${Object.values(Enum.SubjectType).join(", ")}`
        ),

    body("subjects.*.subjectCategory")
        .notEmpty()
        .withMessage("Subject category is required")
        .isIn(Object.values(Enum.SubjectCategory))
        .withMessage(
            `Subject category must be one of: ${Object.values(Enum.SubjectCategory).join(", ")}`
        ),

    body("subjects.*.syllabus")
        .optional()
        .isString()
        .withMessage("Syllabus must be a string"),
];

export const editSubject = [
    param("subjectId")
        .notEmpty().withMessage("Subject ID is required")
        .isMongoId().withMessage("Subject ID must be a valid Mongo ID"),

    body("name")
        .optional()
        .isString().withMessage("Subject name must be a string"),

    body("publication")
        .optional()
        .isString().withMessage("Publication must be a string"),

    body("writer")
        .optional()
        .isString().withMessage("Writer must be a string"),

    body("ISBN")
        .optional()
        .isString().withMessage("ISBN must be a string"),

    body("subjectType")
        .optional()
        .isIn(Object.values(Enum.SubjectType))
        .withMessage(`Subject type must be one of: ${Object.values(Enum.SubjectType).join(", ")}`),

    body("subjectCategory")
        .optional()
        .isIn(Object.values(Enum.SubjectCategory))
        .withMessage(`Subject category must be one of: ${Object.values(Enum.SubjectCategory).join(", ")}`),

    body("syllabus")
        .optional()
        .isString().withMessage("Syllabus must be a string"),
];

export const deleteSubject = [
    param("subjectId")
        .notEmpty().withMessage("Subject ID is required")
        .isMongoId().withMessage("Subject ID must be a valid Mongo ID"),
];

export const getAllSubjects = [
    query("sessionId")
        .notEmpty().withMessage("Session ID is required")
        .isMongoId().withMessage("Session ID must be a valid Mongo ID"),
    query("page")
        .optional()
        .isInt({ min: 1 }).withMessage("Page must be a positive integer"),
    query("limit")
        .optional()
        .isInt({ min: 1 }).withMessage("Limit must be a positive integer"),
    query("search")
        .optional()
        .isString().withMessage("Search must be a string"),
    query("classId")
        .optional()
        .isMongoId().withMessage("Class ID must be a valid Mongo ID"),
];

// section validation
export const createSection = [
    body("name")
        .notEmpty().withMessage("Section name is required")
        .isString().withMessage("Section name must be a string"),
    body("classId")
        .notEmpty().withMessage("Class ID is required")
        .isMongoId().withMessage("Class ID must be a valid Mongo ID"),
    body("classTeacher")
        .optional()
        .isMongoId().withMessage("Class Teacher must be a valid Mongo ID"),
    body("capacity")
        .optional()
        .isNumeric().withMessage("Section Capacity must be a number"),
];

export const createSectionsBulk = [
    body("sections")
        .isArray({ min: 1 })
        .withMessage("Sections must be a non-empty array"),

    body("sections.*.name")
        .notEmpty()
        .withMessage("Section name is required")
        .isString()
        .withMessage("Section name must be a string"),

    body("sections.*.classId")
        .notEmpty()
        .withMessage("Class ID is required")
        .isMongoId()
        .withMessage("Class ID must be a valid Mongo ID"),

    body("sections.*.classTeacher")
        .optional()
        .isMongoId()
        .withMessage("Class Teacher must be a valid Mongo ID"),

    body("sections.*.capacity")
        .optional()
        .isNumeric()
        .withMessage("Section Capacity must be a number"),
];

export const editSection = [
    param("sectionId")
        .notEmpty().withMessage("Section ID is required")
        .isMongoId().withMessage("Section ID must be a valid Mongo ID"),
    body("name")
        .optional()
        .isString().withMessage("Section name must be a string"),
    body("classTeacher")
        .optional()
        .isMongoId().withMessage("Class Teacher must be a valid Mongo ID"),
    body("capacity")
        .optional()
        .isNumeric().withMessage("Section Capacity must be a number"),
];

export const deleteSection = [
    param("sectionId")
        .notEmpty().withMessage("Section ID is required")
        .isMongoId().withMessage("Section ID must be a valid Mongo ID"),
];

export const getAllSections = [
    query("sessionId")
        .notEmpty().withMessage("Session ID is required")
        .isMongoId().withMessage("Session ID must be a valid Mongo ID"),
    query("classId")
        .notEmpty().withMessage("Class ID is required")
        .isMongoId().withMessage("Class ID must be a valid Mongo ID"),
];

// Class Validation
export const createClass = [
    body("name")
        .notEmpty().withMessage("Name is required")
        .isIn(Object.values(Enum.ClassName)).withMessage(`Course stream must be one of: ${Object.values(Enum.ClassName).join(", ")}`),

    body("session")
        .notEmpty().withMessage("Session is required")
        .isMongoId().withMessage("Session must be a valid Mongo ID"),

    body("subjects")
        .optional()
        .isArray().withMessage("Subjects must be an array")
        .custom((subjects) => {
            return subjects.every((id: string) => mongoose.Types.ObjectId.isValid(id));
        })
        .withMessage("Each subject must be a valid MongoDB ObjectId"),

    body("courseStream")
        .optional()
        .isIn(Object.values(Enum.CourseStream)).withMessage(`Course stream must be one of: ${Object.values(Enum.CourseStream).join(", ")}`),

    body("feeStructure")
        .optional(),

    body("feeStructure.monthly.amount")
        .optional()
        .isNumeric().withMessage("Monthly amount must be a number"),

    body("feeStructure.monthly.total")
        .optional()
        .isNumeric().withMessage("Monthly total must be a number"),

    body("feeStructure.quarterly.amount")
        .optional()
        .isNumeric().withMessage("Quarterly amount must be a number"),

    body("feeStructure.quarterly.total")
        .optional()
        .isNumeric().withMessage("Quarterly total must be a number"),

    body("feeStructure.halfYearly.amount")
        .optional()
        .isNumeric().withMessage("Half-yearly amount must be a number"),

    body("feeStructure.halfYearly.total")
        .optional()
        .isNumeric().withMessage("Half-yearly total must be a number"),

    body("feeStructure.yearly.amount")
        .optional()
        .isNumeric().withMessage("Yearly amount must be a number"),

    body("feeStructure.yearly.total")
        .optional()
        .isNumeric().withMessage("Yearly total must be a number"),
];

export const editClass = [
    param("classId")
        .notEmpty().withMessage("Class ID is required")
        .isMongoId().withMessage("Class ID must be a valid Mongo ID"),

    body("subjects")
        .optional()
        .isArray().withMessage("Subjects must be an array")
        .custom((subjects) => {
            return subjects.every((id: string) => mongoose.Types.ObjectId.isValid(id));
        })
        .withMessage("Each subject must be a valid MongoDB ObjectId"),

    body("courseStream")
        .optional()
        .isIn(Object.values(Enum.CourseStream))
        .withMessage(`Course stream must be one of: ${Object.values(Enum.CourseStream).join(", ")}`),

    body("feeStructure")
        .optional()
        .isObject().withMessage("Fee structure must be an object"),

    body("feeStructure.monthly.amount")
        .optional()
        .isNumeric().withMessage("Monthly amount must be a number"),

    body("feeStructure.monthly.total")
        .optional()
        .isNumeric().withMessage("Monthly total must be a number"),

    body("feeStructure.quarterly.amount")
        .optional()
        .isNumeric().withMessage("Quarterly amount must be a number"),

    body("feeStructure.quarterly.total")
        .optional()
        .isNumeric().withMessage("Quarterly total must be a number"),

    body("feeStructure.halfYearly.amount")
        .optional()
        .isNumeric().withMessage("Half-yearly amount must be a number"),

    body("feeStructure.halfYearly.total")
        .optional()
        .isNumeric().withMessage("Half-yearly total must be a number"),

    body("feeStructure.yearly.amount")
        .optional()
        .isNumeric().withMessage("Yearly amount must be a number"),

    body("feeStructure.yearly.total")
        .optional()
        .isNumeric().withMessage("Yearly total must be a number"),
];

export const getAllClass = [
    param("sessionId")
        .notEmpty().withMessage("Session ID is required")
        .isMongoId().withMessage("Session ID must be a valid Mongo ID"),
];

// old class validation


export const getClassById = [
    param("classId")
        .notEmpty().withMessage("Class ID is required")
        .isMongoId().withMessage("Class ID must be a valid Mongo ID"),
];

export const assignFaculty = [
    param("sessionId")
        .notEmpty().withMessage("Session ID is required")
        .isMongoId().withMessage("Session ID must be a valid Mongo ID"),
    body("classId")
        .notEmpty().withMessage("Class ID is required")
        .isMongoId().withMessage("Class ID must be a valid Mongo ID"),
    body("sectionId")
        .notEmpty().withMessage("Section ID is required")
        .isMongoId().withMessage("Section ID must be a valid Mongo ID"),
    body("facultyId")
        .notEmpty().withMessage("Faculty ID is required")
        .isMongoId().withMessage("Faculty ID must be a valid Mongo ID"),
]

export const removeFaculty = [
    param("sessionId")
        .notEmpty().withMessage("Session ID is required")
        .isMongoId().withMessage("Session ID must be a valid Mongo ID"),
    body("classId")
        .notEmpty().withMessage("Class ID is required")
        .isMongoId().withMessage("Class ID must be a valid Mongo ID"),
    body("sectionId")
        .notEmpty().withMessage("Section ID is required")
        .isMongoId().withMessage("Section ID must be a valid Mongo ID"),
]

const weeklyScheduleValidator = [
    body("weeklySchedule")
        .isArray({ min: 1 }).withMessage("Weekly Schedule must be a non-empty array"),

    body("weeklySchedule.*.day")
        .notEmpty().withMessage("Day is required")
        .isIn(Object.values(Enum.WeekDay)).withMessage(`Day must be one of: ${Object.values(Enum.WeekDay).join(", ")}`),

    body("weeklySchedule.*.periods")
        .optional()
        .isArray().withMessage("Periods must be an array"),

    body("weeklySchedule.*.periods.*.periodType")
        .notEmpty().withMessage("Period type is required")
        .isIn(Object.values(Enum.PeriodType)).withMessage(`Period type must be one of: ${Object.values(Enum.PeriodType).join(", ")}`),

    body("weeklySchedule.*.periods.*.periodNumber")
        .optional()
        .isNumeric().withMessage("Period number must be a number"),

    body("weeklySchedule.*.periods.*.subject")
        .optional()
        .isMongoId().withMessage("Subject must be a valid Mongo ID"),

    body("weeklySchedule.*.periods.*.faculty")
        .optional()
        .isMongoId().withMessage("Faculty must be a valid Mongo ID"),

    body("weeklySchedule.*.periods.*.room")
        .optional()
        .isString().withMessage("Room must be a string"),

    body("weeklySchedule.*.periods.*.timeSlot.start.hour")
        .notEmpty().withMessage("Start hour is required")
        .isInt({ min: 0, max: 23 }).withMessage("Start hour must be between 0 and 23"),

    body("weeklySchedule.*.periods.*.timeSlot.start.minute")
        .notEmpty().withMessage("Start minute is required")
        .isInt({ min: 0, max: 59 }).withMessage("Start minute must be between 0 and 59"),

    body("weeklySchedule.*.periods.*.timeSlot.end.hour")
        .notEmpty().withMessage("End hour is required")
        .isInt({ min: 0, max: 23 }).withMessage("End hour must be between 0 and 23"),

    body("weeklySchedule.*.periods.*.timeSlot.end.minute")
        .notEmpty().withMessage("End minute is required")
        .isInt({ min: 0, max: 59 }).withMessage("End minute must be between 0 and 59"),

    body("weeklySchedule.*.isHoliday")
        .optional()
        .isBoolean().withMessage("isHoliday must be a boolean"),

    body("weeklySchedule.*.holidayReason")
        .optional()
        .isString().withMessage("Holiday reason must be a string"),
];

export const createTimeTable = [
    param("sessionId")
        .notEmpty().withMessage("Session Id is required")
        .isMongoId().withMessage("Session Id must be a valid Mongo ID"),

    param("sectionId")
        .notEmpty().withMessage("Section Id is required")
        .isMongoId().withMessage("Section Id must be a valid Mongo ID"),

    param("classId")
        .notEmpty().withMessage("Class Id is required")
        .isMongoId().withMessage("Class Id must be a valid Mongo ID"),

    ...weeklyScheduleValidator,
];

export const editTimeTable = [
    body("timeTableId")
        .notEmpty().withMessage("Time Table Id is required")
        .isMongoId().withMessage("Time Table Id must be a valid Mongo ID"),

    body("sessionId")
        .notEmpty().withMessage("Session Id is required")
        .isMongoId().withMessage("Session Id must be a valid Mongo ID"),

    body("sectionId")
        .notEmpty().withMessage("Section Id is required")
        .isMongoId().withMessage("Section Id must be a valid Mongo ID"),

    body("classId")
        .notEmpty().withMessage("Class Id is required")
        .isMongoId().withMessage("Class Id must be a valid Mongo ID"),

    ...weeklyScheduleValidator,
];

export const getTimeTableofClass = [
    param("sessionId")
        .notEmpty().withMessage("Session Id is required")
        .isMongoId().withMessage("Session Id must be a valid Mongo ID"),
    param("classId")
        .optional()
        .isMongoId().withMessage("Class Id must be a valid Mongo ID"),
    param("sectionId")
        .optional()
        .isMongoId().withMessage("Section Id must be a valid Mongo ID"),
];

