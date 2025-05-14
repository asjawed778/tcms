import { body, param } from "express-validator";
import * as Enum from "../common/constant/enum";

export const addStudent = [
    // Personal Details
    body("name")
        .notEmpty().withMessage("Student name is required")
        .isString().withMessage("Student name must be a string"),

    body("dob")
        .notEmpty().withMessage("Date of birth is required")
        .isISO8601().withMessage("Date of birth must be a valid ISO date"),

    body("gender")
        .notEmpty().withMessage("Gender is required")
        .isIn(Object.values(Enum.Gender)).withMessage("Gender must be one of: " + Object.values(Enum.Gender).join(", ")),

    body("nationality")
        .notEmpty().withMessage("Nationality is required"),

    body("religion")
        .notEmpty().withMessage("Religion is required")
        .isIn(Object.values(Enum.Religion)).withMessage("Religion must be one of: " + Object.values(Enum.Religion).join(", ")),

    body("motherTongue")
        .notEmpty().withMessage("Mother tongue is required"),

    body("image")
        .notEmpty().withMessage("Student image URL is required"),

    body("adharNumber")
        .notEmpty().withMessage("Aadhar number is required")
        .isLength({ min: 12, max: 12 }).withMessage("Aadhar number must be 12 digits"),

    body("contactNumber")
        .optional()
        .isMobilePhone("en-IN").withMessage("Contact number must be a valid Indian mobile number"),

    body("email")
        .optional()
        .isEmail().withMessage("Email must be a valid email address"),

    body("bloodGroup")
        .optional()
        .isIn(Object.values(Enum.BloodGroup)).withMessage("Invalid blood group"),

    // Parent: Father
    body("father.name")
        .notEmpty().withMessage("Father's name is required"),

    body("father.qualification")
        .notEmpty().withMessage("Father's qualification is required"),

    body("father.occupation")
        .notEmpty().withMessage("Father's occupation is required"),

    body("father.businessOrEmployerName")
        .optional().isString().withMessage("Father's employer name must be a string"),

    body("father.officeAddress")
        .optional().isString().withMessage("Father's office address must be a string"),

    body("father.officeNumber")
        .optional().isString().withMessage("Father's office number must be a string"),

    body("father.email")
        .optional().isEmail().withMessage("Father's email must be a valid email address"),

    body("father.contactNumber")
        .optional().isMobilePhone("en-IN").withMessage("Father's contact number must be valid"),

    // Parent: Mother
    body("mother.name")
        .notEmpty().withMessage("Mother's name is required"),

    body("mother.qualification")
        .notEmpty().withMessage("Mother's qualification is required"),

    body("mother.occupation")
        .notEmpty().withMessage("Mother's occupation is required"),

    body("mother.businessOrEmployerName")
        .optional().isString(),

    body("mother.officeAddress")
        .optional().isString(),

    body("mother.officeNumber")
        .optional().isString(),

    body("mother.email")
        .optional().isEmail(),

    body("mother.contactNumber")
        .optional().isMobilePhone("en-IN"),

    // Local Guardian (optional)
    body("localGuardian.name")
        .optional().isString(),

    body("localGuardian.contactNumber")
        .optional().isMobilePhone("en-IN"),

    // Previous School (optional)
    body("previousSchool.name")
        .optional().isString().withMessage("Previous school name must be a string"),

    body("previousSchool.address")
        .optional().isString().withMessage("Previous school address must be a string"),

    body("previousSchool.reasonForLeaving")
        .optional().isString().withMessage("Reason for leaving must be a string"),

    body("previousSchool.dateOfLeaving")
        .optional().isISO8601().withMessage("Date of leaving must be a valid date"),

    body("previousSchool.schoolLeavingCertificate.name")
        .optional().isString(),

    body("previousSchool.schoolLeavingCertificate.url")
        .optional().isURL().withMessage("School leaving certificate URL must be valid"),

    body("previousSchool.transferCertificate.name")
        .optional().isString(),

    body("previousSchool.transferCertificate.url")
        .optional().isURL().withMessage("Transfer certificate URL must be valid"),

    // Documents (optional array)
    body("documents").optional().isArray(),

    body("documents.*.name")
        .optional().isString().withMessage("Each document must have a name"),

    body("documents.*.url")
        .optional().isURL().withMessage("Each document URL must be valid"),

    // Full Address Object
    body("address.addressLine1")
        .notEmpty().withMessage("Address Line 1 is required"),

    body("address.addressLine2")
        .optional().isString(),

    body("address.city")
        .notEmpty().withMessage("City is required"),

    body("address.state")
        .notEmpty().withMessage("State is required"),

    body("address.country")
        .notEmpty().withMessage("Country is required"),

    body("address.pincode")
        .notEmpty().withMessage("Pincode is required")
        .isPostalCode("IN").withMessage("Pincode must be a valid Indian postal code"),

    body("session")
        .notEmpty().withMessage("Session ID is required")
        .isMongoId().withMessage("Invalid Session ID"),

    body("class")
        .notEmpty().withMessage("Class ID is required")
        .isMongoId().withMessage("Invalid Class ID"),

    body("section")
        .notEmpty().withMessage("Section ID is required")
        .isMongoId().withMessage("Invalid Section ID"),

    // Admission Info
    body("admissionYear")
        .notEmpty().withMessage("Admission year is required")
        .isInt({ min: 2000, max: 2100 }).withMessage("Admission year must be between 2000 and 2100"),
];

export const getStudents = [
    param("session")
        .notEmpty().withMessage("Session ID is required")
        .isMongoId().withMessage("Invalid Session ID"),

    // Query parameters
    body("page")
        .optional()
        .isInt({ min: 1 }).withMessage("Page must be a positive integer"),

    body("limit")
        .optional()
        .isInt({ min: 1 }).withMessage("Limit must be a positive integer"),

    body("search")
        .optional()
        .isString().withMessage("Search must be a string"),

    body("standard")
        .optional()
        .isMongoId().withMessage("Invalid Standard ID"),

    body("section")
        .optional()
        .isMongoId().withMessage("Invalid Section ID"),
];
