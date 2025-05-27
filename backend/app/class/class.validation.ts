import { body, param } from 'express-validator';
import * as Enum from '../common/constant/enum';

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
            return subjects.every((subject: any) => {
                return (
                    typeof subject.name === "string" &&
                    subject.name.trim() !== "" &&
                    (!subject.publication || typeof subject.publication === "string") &&
                    (!subject.writer || typeof subject.writer === "string") &&
                    (!subject.ISBN || typeof subject.ISBN === "string") &&
                    Object.values(Enum.SubjectType).includes(subject.subjectType) &&
                    Object.values(Enum.SubjectCategory).includes(subject.subjectCategory)
                );
            });
        })
        .withMessage("Each subject must be a valid subject object with required fields"),

    body("courseStream")
        .optional()
        .isIn(Object.values(Enum.CourseStream)).withMessage(`Course stream must be one of: ${Object.values(Enum.CourseStream).join(", ")}`),

    body("sections")
        .notEmpty().withMessage("At lease one section is required")
        .isArray().withMessage("Section must be an array"),

    body("sections.*.name")
        .notEmpty().withMessage("Section name is requred")
        .isString().withMessage("Section name must be string"),

    body("sections.*.classTeacher")
        .optional()
        .isMongoId().withMessage("Class Teacher must be a valid mongo id"),

    body("sections.*.capacity")
        .optional()
        .isNumeric().withMessage("Section Capacity must be a Number"),

    body("feeStructure")
        .notEmpty().withMessage("Fee structure is required"),

    body("feeStructure.monthly.amount")
        .notEmpty().withMessage("Monthly amount is required")
        .isNumeric().withMessage("Monthly amount must be a number"),

    body("feeStructure.monthly.total")
        .notEmpty().withMessage("Monthly total is required")
        .isNumeric().withMessage("Monthly total must be a number"),

    body("feeStructure.quarterly.amount")
        .notEmpty().withMessage("Quarterly amount is required")
        .isNumeric().withMessage("Quarterly amount must be a number"),

    body("feeStructure.quarterly.total")
        .notEmpty().withMessage("Quarterly total is required")
        .isNumeric().withMessage("Quarterly total must be a number"),

    body("feeStructure.halfYearly.amount")
        .notEmpty().withMessage("Half-yearly amount is required")
        .isNumeric().withMessage("Half-yearly amount must be a number"),

    body("feeStructure.halfYearly.total")
        .notEmpty().withMessage("Half-yearly total is required")
        .isNumeric().withMessage("Half-yearly total must be a number"),

    body("feeStructure.yearly.amount")
        .notEmpty().withMessage("Yearly amount is required")
        .isNumeric().withMessage("Yearly amount must be a number"),

    body("feeStructure.yearly.total")
        .notEmpty().withMessage("Yearly total is required")
        .isNumeric().withMessage("Yearly total must be a number"),
];

export const getAllClass = [
    param("sessionId")
        .notEmpty().withMessage("Session ID is required")
        .isMongoId().withMessage("Session ID must be a valid Mongo ID"),
];

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

    body("weeklySchedule.*.periods.*.timeSlot.durationMinutes")
        // .notEmpty().withMessage("Duration in minutes is required")
        .optional()
        .isInt({ min: 1 }).withMessage("Duration must be at least 1 minute"),

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

