import { body, param, query } from 'express-validator';
import * as Enum from '../common/utils/enum';
import mongoose from 'mongoose';

// ------------ Subject Validation --------------
export const createSubject = [
    // subject fields
    body("name")
        .notEmpty().withMessage("Subject name is required")
        .isString().withMessage("Subject name must be a string"),

    body("sessionId")
        .notEmpty().withMessage("Session ID is required")
        .isMongoId().withMessage("Session ID must be a valid Mongo ID"),

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

    // books array
    body("books")
        .optional()
        .isArray().withMessage("Books must be an array"),

    body("books.*.title")
        .notEmpty().withMessage("Book title is required")
        .isString().withMessage("Book title must be a string"),

    body("books.*.coverPhoto")
        .optional()
        .isString().withMessage("Cover photo must be a string"),

    body("books.*.publication")
        .optional()
        .isString().withMessage("Publication must be a string"),

    body("books.*.author")
        .optional()
        .isString().withMessage("Author must be a string"),

    body("books.*.ISBN")
        .optional()
        .isString().withMessage("ISBN must be a string"),
];

export const createSubjectBulk = [
    body("subjects")
        .isArray({ min: 1 })
        .withMessage("Subjects must be a non-empty array"),

    // subject fields
    body("subjects.*.name")
        .notEmpty().withMessage("Subject name is required")
        .isString().withMessage("Subject name must be a string"),

    body("subjects.*.sessionId")
        .notEmpty().withMessage("Session ID is required")
        .isMongoId().withMessage("Session ID must be a valid Mongo ID"),

    body("subjects.*.subjectType")
        .notEmpty().withMessage("Subject type is required")
        .isIn(Object.values(Enum.SubjectType))
        .withMessage(
            `Subject type must be one of: ${Object.values(Enum.SubjectType).join(", ")}`
        ),

    body("subjects.*.subjectCategory")
        .notEmpty().withMessage("Subject category is required")
        .isIn(Object.values(Enum.SubjectCategory))
        .withMessage(
            `Subject category must be one of: ${Object.values(Enum.SubjectCategory).join(", ")}`
        ),

    body("subjects.*.syllabus")
        .optional()
        .isString().withMessage("Syllabus must be a string"),

    // books
    body("subjects.*.books")
        .optional()
        .isArray().withMessage("Books must be an array"),

    body("subjects.*.books.*.title")
        .notEmpty().withMessage("Book title is required")
        .isString().withMessage("Book title must be a string"),

    body("subjects.*.books.*.coverPhoto")
        .optional()
        .isString().withMessage("Cover photo must be a string"),

    body("subjects.*.books.*.publication")
        .optional()
        .isString().withMessage("Publication must be a string"),

    body("subjects.*.books.*.author")
        .optional()
        .isString().withMessage("Author must be a string"),

    body("subjects.*.books.*.ISBN")
        .optional()
        .isString().withMessage("ISBN must be a string"),
];

export const editSubject = [
    param("subjectId")
        .notEmpty().withMessage("Subject ID is required")
        .isMongoId().withMessage("Subject ID must be a valid Mongo ID"),

    body("name")
        .optional()
        .isString().withMessage("Subject name must be a string"),

    body("sessionId")
        .optional()
        .isMongoId().withMessage("Session ID must be a valid Mongo ID"),

    body("subjectType")
        .optional()
        .isIn(Object.values(Enum.SubjectType))
        .withMessage(
            `Subject type must be one of: ${Object.values(Enum.SubjectType).join(", ")}`
        ),

    body("subjectCategory")
        .optional()
        .isIn(Object.values(Enum.SubjectCategory))
        .withMessage(
            `Subject category must be one of: ${Object.values(Enum.SubjectCategory).join(", ")}`
        ),

    body("syllabus")
        .optional()
        .isString().withMessage("Syllabus must be a string"),

    body("books")
        .optional()
        .isArray().withMessage("Books must be an array"),

    body("books.*.title")
        .optional()
        .isString().withMessage("Book title must be a string"),

    body("books.*.coverPhoto")
        .optional()
        .isString().withMessage("Cover photo must be a string"),

    body("books.*.publication")
        .optional()
        .isString().withMessage("Publication must be a string"),

    body("books.*.author")
        .optional()
        .isString().withMessage("Author must be a string"),

    body("books.*.ISBN")
        .optional()
        .isString().withMessage("ISBN must be a string"),
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
// create class : step - 1
export const createClass = [
    body("name")
        .notEmpty().withMessage("Name is required")
        .isIn(Object.values(Enum.ClassName)).withMessage(`Course stream must be one of: ${Object.values(Enum.ClassName).join(", ")}`),

    body("session")
        .notEmpty().withMessage("Session is required")
        .isMongoId().withMessage("Session must be a valid Mongo ID"),

    body("courseStream")
        .optional()
        .isIn(Object.values(Enum.CourseStream)).withMessage(`Course stream must be one of: ${Object.values(Enum.CourseStream).join(", ")}`),
];

// create class : step - 2
export const upsertSubjectBulk = [
    body("subjects")
        .isArray({ min: 1 })
        .withMessage("Subjects must be a non-empty array"),

    body("subjects.*.name")
        .notEmpty().withMessage("Subject name is required")
        .isString().withMessage("Subject name must be a string"),

    body("subjects.*._id")
        .optional()
        .isString().withMessage("Subject ID must be a string"),

    body("subjects.*.classId")
        .optional()
        .isMongoId().withMessage("Class ID must be a valid Mongo ID"),

    body("subjects.*.sessionId")
        .notEmpty().withMessage("Session ID is required")
        .isMongoId().withMessage("Session ID must be a valid Mongo ID"),

    body("subjects.*.subjectType")
        .notEmpty().withMessage("Subject type is required")
        .isIn(Object.values(Enum.SubjectType))
        .withMessage(`Invalid subject type`),

    body("subjects.*.syllabus")
        .optional()
        .isString().withMessage("Syllabus must be a string"),

    // books array (optional)
    body("subjects.*.books")
        .optional()
        .isArray().withMessage("Books must be an array"),

    body("subjects.*.books.*.title")
        .if(body("subjects.*.books").exists())
        .notEmpty().withMessage("Book title is required")
        .isString().withMessage("Book title must be a string"),

    body("subjects.*.books.*.coverPhoto")
        .optional()
        .isString().withMessage("Cover photo must be a string"),

    body("subjects.*.books.*.publication")
        .optional()
        .isString().withMessage("Publication must be a string"),

    body("subjects.*.books.*.author")
        .optional()
        .isString().withMessage("Author must be a string"),

    body("subjects.*.books.*.ISBN")
        .optional()
        .isString().withMessage("ISBN must be a string"),
];

// create class : step - 3
export const upsertClassFeeStructure = [
    param("classId")
        .notEmpty().withMessage("Class ID is required")
        .isMongoId().withMessage("Class ID must be a valid Mongo ID"),

    body("session")
        .notEmpty().withMessage("Academic Session ID is required")
        .isMongoId().withMessage("Academic Session ID must be a valid Mongo ID"),

    body("effectiveFrom")
        .notEmpty().withMessage("Effective From date is required")
        .isISO8601().withMessage("Effective From must be a valid date"),

    body("feeDetails")
        .isArray({ min: 1 })
        .withMessage("Fee details must be an array with at least one item"),

    body("feeDetails.*.feeType")
        .notEmpty().withMessage("Fee type is required")
        .isString().withMessage("Fee type must be a string"),

    body("feeDetails.*.amount")
        .notEmpty().withMessage("Amount is required")
        .isNumeric().withMessage("Amount must be a number"),

    body("feeDetails.*.isOptional")
        .optional()
        .isBoolean().withMessage("isOptional must be a boolean value"),

    body("feeDetails.*.billingFrequency")
        .optional()
        .isIn(Object.values(Enum.FeeFrequency)).withMessage("Invalid billing frequency"),

    body("remarks")
        .optional()
        .isString().withMessage("Remarks must be a string"),

    body("status")
        .optional()
        .isIn(Object.values(Enum.ActiveStatus)).withMessage("Invalid status value"),
];

export const updateClass = [
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
];

export const getAllClass = [
    query("sessionId")
        .notEmpty().withMessage("Session ID is required")
        .isMongoId().withMessage("Session ID must be a valid Mongo ID"),
];

// class subjects
export const getSubjectsByClass = [
    param("classId")
        .notEmpty().withMessage("Class ID is required")
        .isMongoId().withMessage("Class ID must be a valid Mongo ID"),

    query("sessionId")
        .optional()
        .isMongoId().withMessage("Session ID must be a valid Mongo ID"),

    query("subjectType")
        .optional()
        .isIn(Object.values(Enum.SubjectType))
        .withMessage("Invalid subject type")
];

// ------------ Class Timetable Validation --------------
export const createTimeTable = [
    body("sessionId")
        .notEmpty().withMessage("Session is required")
        .isMongoId().withMessage("Invalid session ID"),

    body("classId")
        .notEmpty().withMessage("Class is required")
        .isMongoId().withMessage("Invalid class ID"),

    body("sectionId")
        .notEmpty().withMessage("Section is required")
        .isMongoId().withMessage("Invalid section ID"),

    // ===== WEEKLY SCHEDULE =====
    body("weeklySchedule")
        .isArray({ min: 1 })
        .withMessage("Weekly schedule must be a non-empty array"),

    body("weeklySchedule.*.day")
        .isIn(Object.values(Enum.WeekDay))
        .withMessage("Invalid week day"),

    body("weeklySchedule.*.isHoliday")
        .optional()
        .isBoolean().withMessage("isHoliday must be boolean"),

    body("weeklySchedule.*.holidayReason")
        .optional()
        .isString().trim().withMessage("Holiday reason must be a string"),

    // ===== PERIODS (only if not holiday) =====
    body("weeklySchedule.*.periods")
        .optional()
        .isArray().withMessage("Periods must be an array"),

    body("weeklySchedule.*.periods.*.periodType")
        .optional()
        .isIn(Object.values(Enum.PeriodType)).withMessage("Invalid period type"),

    body("weeklySchedule.*.periods.*.periodNumber")
        .optional()
        .isInt({ min: 1 }).withMessage("Period number must be a positive integer"),

    body("weeklySchedule.*.periods.*.subject")
        .optional()
        .isMongoId().withMessage("Invalid subject ID"),

    body("weeklySchedule.*.periods.*.faculty")
        .optional()
        .isMongoId().withMessage("Invalid faculty ID"),

    body("weeklySchedule.*.periods.*.room")
        .optional()
        .isString().trim().withMessage("Room must be a string"),

    // ===== TIME SLOT =====
    body("weeklySchedule.*.periods.*.timeSlot.startTime")
        .matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
        .withMessage("Invalid start time (HH:mm)"),

    body("weeklySchedule.*.periods.*.timeSlot.endTime")
        .matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
        .withMessage("Invalid end time (HH:mm)"),

    body("weeklySchedule.*.periods.*.timeSlot.duration")
        .matches(/^PT(\d+H)?(\d+M)?$/)
        .withMessage("Invalid duration format (ISO 8601)"),

    // ===== EFFECTIVE DATES =====
    body("effectiveFrom")
        .optional()
        .isISO8601().withMessage("Invalid effectiveFrom date"),

    body("effectiveTo")
        .optional({ nullable: true })
        .isISO8601().withMessage("Invalid effectiveTo date"),
];

export const updateTimeTableValidator = [

    param("id")
        .isMongoId()
        .withMessage("Invalid timetable ID"),

    ...createTimeTable.map(v => v.optional())
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

// export const createTimeTable = [
//     param("sessionId")
//         .notEmpty().withMessage("Session Id is required")
//         .isMongoId().withMessage("Session Id must be a valid Mongo ID"),

//     param("sectionId")
//         .notEmpty().withMessage("Section Id is required")
//         .isMongoId().withMessage("Section Id must be a valid Mongo ID"),

//     param("classId")
//         .notEmpty().withMessage("Class Id is required")
//         .isMongoId().withMessage("Class Id must be a valid Mongo ID"),

//     ...weeklyScheduleValidator,
// ];

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

