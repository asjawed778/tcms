import { body, param, query } from "express-validator";
import * as Enum from "../common/utils/enum";

// Personal Details
export const addPersonalDetails = [
    body("firstName")
        .notEmpty().withMessage("Student name is required")
        .isString().withMessage("Student name must be a string"),

    body("lastName")
        .optional()
        .isString().withMessage("Student name must be a string"),

    body("dob")
        .notEmpty().withMessage("Date of birth is required")
        .isISO8601().withMessage("Date of birth must be a valid ISO date"),

    body("gender")
        .notEmpty().withMessage("Gender is required")
        .isIn(Object.values(Enum.Gender)).withMessage("Gender must be one of: " + Object.values(Enum.Gender).join(", ")),

    body("nationality")
        .optional(),

    body("religion")
        .optional()
        .isIn(Object.values(Enum.Religion)).withMessage("Religion must be one of: " + Object.values(Enum.Religion).join(", ")),

    body("motherTongue")
        .optional(),

    body("photo")
        .optional(),

    body("adharNumber")
        .optional()
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
];

export const updatePersonalDetails = [
    param("studentId")
        .notEmpty().withMessage("Student ID is required")
        .isMongoId().withMessage("Invalid Student ID"),
    ...addPersonalDetails,
];

// address details validation
export const upsertStudentAddress = [
    param("studentId")
        .notEmpty().withMessage("Student ID is required")
        .isMongoId().withMessage("Invalid Student ID"),

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
];

// parent details validation
export const upsertStudentParentsInfo = [
    param("studentId")
        .notEmpty().withMessage("Student ID is required")
        .isMongoId().withMessage("Invalid Student ID"),

    body("father.name")
        .optional(),

    body("father.qualification")
        .optional(),

    body("father.occupation")
        .notEmpty(),

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
        .optional(),

    body("mother.qualification")
        .optional(),

    body("mother.occupation")
        .optional(),

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
        .optional(),

    body("localGuardian.qualification")
        .optional(),

    body("localGuardian.occupation")
        .optional(),

    body("localGuardian.businessOrEmployerName")
        .optional().isString(),

    body("localGuardian.officeAddress")
        .optional().isString(),

    body("localGuardian.officeNumber")
        .optional().isString(),

    body("localGuardian.email")
        .optional().isEmail(),

    body("localGuardian.contactNumber")
        .optional().isMobilePhone("en-IN"),
];

// admission and previous school details validation
export const upsertStudentAdmissinInfo = [
    param("studentId")
        .notEmpty().withMessage("Student ID is required")
        .isMongoId().withMessage("Invalid Student ID"),

    // Admission Info
    body("session")
        .notEmpty().withMessage("Session ID is required")
        .isMongoId().withMessage("Invalid Session ID"),

    body("class")
        .notEmpty().withMessage("Class ID is required")
        .isMongoId().withMessage("Invalid Class ID"),

    body("section")
        .notEmpty().withMessage("Section ID is required")
        .isMongoId().withMessage("Invalid Section ID"),

    body("admissionYear")
        .notEmpty().withMessage("Admission year is required")
        .isInt({ min: 2000, max: 2100 }).withMessage("Admission year must be between 2000 and 2100"),

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
];

// additinal documents validation
export const studentAdditionalDoc = [
    param("studentId")
        .notEmpty().withMessage("Student ID is required")
        .isMongoId().withMessage("Invalid Student ID"),

    // Documents (optional array)
    body("documents").optional().isArray(),

    body("documents.*.name")
        .optional().isString().withMessage("Each document must have a name"),

    body("documents.*.url")
        .optional().isURL().withMessage("Each document URL must be valid"),
];

const mapToBulk = (validators: any[]) => {
    return validators.map((v: any) => {
        const field = v.builder?.fields?.[0];
        if (!field) return v;

        const newField = `students.*.${field}`;
        const newValidator = body(newField);
        return newValidator;
    });
};

export const bulkAddStudents = [
    body("students")
        .isArray({ min: 1 })
        .withMessage("Students must be an array with at least one student"),

    ...mapToBulk([
        ...addPersonalDetails,
        ...upsertStudentAddress,
        ...upsertStudentParentsInfo,
        ...upsertStudentAdmissinInfo,
        ...studentAdditionalDoc,
    ]),
];

export const getStudents = [
    // Query parameters
    query("sessionId")
        .optional()
        .isMongoId().withMessage("Invalid Session ID"),

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
        .isMongoId().withMessage("Invalid Standard ID"),

    query("sectionId")
        .optional()
        .isMongoId().withMessage("Invalid Section ID"),

    query("gender")
        .optional()
        .isIn(Object.values(Enum.Gender)).withMessage("Invalid Gender"),

    query("studentStatus")
        .optional()
        .isIn(Object.values(Enum.StudentStatus)).withMessage("Invalid Student Status"),

    query("admissionStatus")
        .optional()
        .isIn(Object.values(Enum.AdmissionStatus)).withMessage("Invalid Student Status"),

    query("bloodGroup")
        .optional()
        .isIn(Object.values(Enum.BloodGroup)).withMessage("Invalid Blood Group"),
];


// old student addition validation code
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

    body("documents.*.documentNumber")
        .optional(),

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
        .notEmpty().withMessage("Pincode is required"),

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



export const getStudentById = [
    param("studentId")
        .notEmpty().withMessage("Student ID is required")
        .isMongoId().withMessage("Invalid Student ID"),
]

export const addRemark = [
    param("sessionId")
        .notEmpty().withMessage("Session ID is required")
        .isMongoId().withMessage("Invalid Session ID"),

    param("studentId")
        .notEmpty().withMessage("Student ID is required")
        .isMongoId().withMessage("Invalid Student ID"),

    body("remarkType")
        .notEmpty().withMessage("Remark Type is required")
        .isIn(Object.values(Enum.RemarkType)).withMessage("Invalid Remark Type"),

    body("description")
        .notEmpty().withMessage("Description is required")
        .isString().withMessage("Description must be a string")
        .trim()
        .isLength({ min: 5 }).withMessage("Description must be at least 5 characters long"),

    body("actionTaken")
        .optional()
        .isIn(Object.values(Enum.ActionTaken)).withMessage("Invalid Action Taken"),

    body("supportingDocuments")
        .optional()
        .isArray().withMessage("Supporting documents must be an array")
        .custom((docs) => {
            if (docs) {
                for (const doc of docs) {
                    if (!doc.name || !doc.url) {
                        throw new Error("Each document must have 'name' and 'url'");
                    }
                    if (typeof doc.name !== 'string' || typeof doc.url !== 'string') {
                        throw new Error("Document 'name' and 'url' must be strings");
                    }
                }
            }
            return true;
        }),
];

