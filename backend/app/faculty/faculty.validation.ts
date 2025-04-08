import { body } from "express-validator";
import { Gender } from "../common/constant/constant";
import * as FacultyEnum from "./faculty.constant";

export const createFaculty = [
    body("name")
        .notEmpty().withMessage("Name is required"),

    body("fatherName")
        .optional().isString().withMessage("Father name must be a string"),

    body("motherName")
        .optional().isString().withMessage("Mother name must be a string"),

    body("email")
        .notEmpty().withMessage("Email is required")
        .isEmail().withMessage("Email must be valid"),

    body("phoneNumber")
        .notEmpty().withMessage("Phone number is required")
        .isMobilePhone("en-IN").withMessage("Enter a valid Indian phone number"),

    body("gender")
        .notEmpty().withMessage("Gender is required")
        .isIn(Object.values(Gender)).withMessage(`Gender must be one of: ${Object.values(Gender).join(", ")}`),

    body("dob")
        .notEmpty().withMessage("Date of birth is required")
        .isISO8601().withMessage("DOB must be a valid date"),

    body("address")
        .notEmpty().withMessage("Address is required"),
    body("address.addressLine1")
        .notEmpty().withMessage("addressLine1 is required in address"),
    body("address.city")
        .notEmpty().withMessage("City is required in address"),
    body("address.state")
        .notEmpty().withMessage("State is required in address"),
    body("address.pincode")
        .notEmpty().withMessage("Pincode is required in address")
        .isPostalCode("IN").withMessage("Enter a valid Indian pincode"),

    body("photoUrl")
        .optional().isURL().withMessage("Photo URL must be valid"),


    body("aadhaarNumber")
        .notEmpty().withMessage("Aadhaar number is required")
        .isLength({ min: 12, max: 12 }).withMessage("Aadhaar number must be 12 digits")
        .isNumeric().withMessage("Aadhaar number must be numeric"),

    body("designation")
        .notEmpty().withMessage("Designation is required")
        .isIn(Object.values(FacultyEnum.Designation)).withMessage(`Designation must be one of: ${Object.values(FacultyEnum.Designation).join(", ")}`),

    body("joiningDate")
        .notEmpty().withMessage("Joining date is required")
        .isISO8601().withMessage("Joining date must be a valid date"),

    body("experience")
        .optional()
        .isArray({ min: 1 })
        .withMessage("Experience must be a non-empty array"),

    body("experience.*.organisationName")
        .optional({ nullable: true })
        .notEmpty().withMessage("Organisation name is required in experience"),

    body("experience.*.years")
        .optional({ nullable: true })
        .notEmpty().withMessage("Years are required in experience")
        .isNumeric().withMessage("Years must be a number"),

    body("experience.*.designation")
        .optional({ nullable: true })
        .notEmpty().withMessage("Designation is required in experience"),

    body("expertiseSubjects")
        .isArray({ min: 1 }).withMessage("At least one subject is required in expertiseSubjects"),

    body("qualification")
        .notEmpty().withMessage("Qualification is required"),

    body("certification")
        .optional().isString().withMessage("Certification must be a string"),

    body("documents")
        .optional()
        .isArray()
        .withMessage("Documents must be an array"),

    body("documents.*.name")
        .optional({ nullable: true })
        .notEmpty()
        .withMessage("Document name is required"),

    body("documents.*.url")
        .optional({ nullable: true })
        .notEmpty()
        .withMessage("Document URL is required"),

    body("documents.*.documentNumber")
        .optional()
        .isString()
        .withMessage("Document number must be a string"),

    body("salary")
        .notEmpty().withMessage("Salary is required")
        .isNumeric().withMessage("Salary must be a number"),
];
