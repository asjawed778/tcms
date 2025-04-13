import { body, param } from 'express-validator';
import * as ClassEnum from './class.constants';

export const createClass = [
    body("name")
        .notEmpty().withMessage("Name is required")
        .isString().withMessage("Name must be a string"),

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
                    Object.values(ClassEnum.SubjectType).includes(subject.subjectType) &&
                    Object.values(ClassEnum.SubjectCategory).includes(subject.subjectCategory)
                );
            });
        })
        .withMessage("Each subject must be a valid subject object with required fields"),

    body("courseStream")
        .optional()
        .isIn(Object.values(ClassEnum.CourseStream)).withMessage(`Course stream must be one of: ${Object.values(ClassEnum.CourseStream).join(", ")}`),

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

