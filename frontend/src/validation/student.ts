import * as yup from "yup";
import * as Enum from "@/utils/enum";
import { validateGroupFields } from "@/utils/helper";

export const personalDetailsSchema = yup.object({
  firstName: yup.string().trim().required("Name is required"),
  dob: yup.string().required("Date of birth is required"),
  email: yup
    .string()
    .optional()
    .nullable()
    .email("Email must be a valid email address"),

  contactNumber: yup
    .string()
    .nullable()
    .notRequired()
    .test(
      "is-valid-phone",
      "Enter a valid Indian phone number (10 digits)",
      (value) => {
        if (!value) return true;
        return /^[0-9]{10}$/.test(value);
      }
    ),

  image: yup.string().optional(),
  gender: yup
    .mixed()
    .oneOf(
      Object.values(Enum.Gender),
      `Gender must be one of: ${Object.values(Enum.Gender).join(", ")}`
    )
    .required("Gender is required"),
  nationality: yup.string().optional().nullable(),
  religion: yup
    .mixed()
    .oneOf(
      Object.values(Enum.Religion),
      `Religion must be one of: ${Object.values(Enum.Religion).join(", ")}`
    )
    .optional()
    .nullable(),
  motherTongue: yup.string().optional().nullable(),
  bloodGroup: yup
    .mixed()
    .optional()
    .nullable()
    .oneOf(
      Object.values(Enum.BloodGroup),
      `Invalid blood group. Must be one of: ${Object.values(
        Enum.BloodGroup
      ).join(", ")}`
    ),
  adharNumber: yup
    .string()
    .nullable()
    .notRequired()
    // .length(12, "Aadhaar number must be 12 digits")
    // .matches(/^\d{12}$/, "Aadhaar number must be numeric"),
    .test("is-valid-aadhar", "Aadhaar number must be (12 digits)", (value) => {
      if (!value) return true;
      return /^\d{12}$/.test(value);
    }),
});
export const addressdetailsSchema = yup.object({
  address: yup.object().shape({
    addressLine1: yup.string().required("addressLine1 is required in address"),
    addressLine2: yup.string().trim().optional().nullable(),
    city: yup.string().required("City is required "),
    state: yup.string().required("State is required "),
    country: yup.string().required("State is required "),
    pincode: yup
      .string()
      .required("Pincode is required")
      .matches(/^[1-9][0-9]{5}$/, "Pincode must be a valid Indian postal code"),
  }),
});
export const parentDetailsSchema = yup.object({
  father: yup.object({
    name: yup.string().required("Name is required"),
    email: yup
      .string()
      .optional()
      .nullable()
      .email("Father's email must be a valid email address"),
    contactNumber: yup
      .string()
      .optional()
      .notRequired()
      .test(
        "is-valid-phone",
        "Enter a valid Indian phone number (10 digits)",
        (value) => {
          if (!value) return true;
          return /^[0-9]{10}$/.test(value);
        }
      ),
    qualification: yup.string().optional().nullable(),
    occupation: yup.string().required("Occupation is required"),
    bussinessOrEmployerName: yup.string().optional(),
    officeAddress: yup.string().optional(),
    officeNumber: yup.string().optional(),
  }),
  mother: yup.object({
    name: yup.string().optional(),
    email: yup
      .string()
      .optional()
      .nullable()
      .email("Mother's email must be a valid email address"),
    contactNumber: yup
      .string()
      .optional()
      .test(
        "is-valid-phone",
        "Enter a valid Indian phone number (10 digits)",
        (value) => {
          if (!value) return true;
          return /^[0-9]{10}$/.test(value);
        }
      ),
    qualification: yup.string().optional(),
    occupation: yup.string().optional(),
    bussinessOrEmployerName: yup.string().optional(),
    officeAddress: yup.string().optional(),
    officeNumber: yup.string().optional(),
  }),
  localGuardian: yup.object({
    name: yup.string().optional(),
    email: yup
      .string()
      .optional()
      .email("Local Guardian's email must be a valid email address"),
    contactNumber: yup
      .string()
      .optional()
      .test(
        "is-valid-phone",
        "Enter a valid Indian phone number (10 digits)",
        (value) => {
          if (!value) return true;
          return /^[0-9]{10}$/.test(value);
        }
      ),
    qualification: yup.string().optional(),
    occupation: yup.string().optional(),
    bussinessOrEmployerName: yup.string().optional(),
    officeAddress: yup.string().optional(),
    officeNumber: yup.string().optional(),
  }),
});
const groupedFields = ["name", "address", "reasonForLeaving", "dateOfLeaving"];

export const previousSchoolSchema = yup.object({
  previousSchool: yup.object({
    name: validateGroupFields(
      "name-required",
      "Name is required",
      groupedFields
    ),
    address: validateGroupFields(
      "address-required",
      "Address is required",
      groupedFields
    ),
    reasonForLeaving: validateGroupFields(
      "reason-required",
      "Reason is required",
      groupedFields
    ),
    dateOfLeaving: validateGroupFields(
      "date-required",
      "Date is required",
      groupedFields
    ),
    // schoolLeavingCertificate: yup.object({
    //   url: validateGroupFields("url-required", "Certificate is required", groupedFields),
    // }),
  }),
  session: yup.string().required("Session is required"),
  class: yup.string().required("Class Name is required"),
  section: yup.string().when("class", (classValue, schema) => {
    if (!classValue) {
      return schema.test(
        "section-blocked",
        "Please select class first",
        () => false
      );
    }
    return schema.required("Section is required");
  }),
  admissionYear: yup
    .number()
    .typeError("Admission year must be a number")
    .required("Admission year is required")
    .integer("Admission year must be an integer")
    .min(2000, "Admission year must be between 2000 and 2100")
    .max(2100, "Admission year must be between 2000 and 2100"),
});

export const documentDetailsSchema = yup.object({
  documents: yup
    .array()
    .of(
      yup.object().shape({
        name: yup.string().nullable().optional(),
        documentNumber: yup.string().nullable().optional(),
        url: yup.string().nullable().optional(),
      })
    )
    .optional(),
});


// Add Remark Schema...........................................
const remarkGroupFields = ["name", "url"];
export const addRemarkSchema = yup.object({
  remarkType: yup
    .string()
    .required("Remark Type is required")
    .oneOf(Object.values(Enum.RemarkType), "Invalid Remark Type"),

  description: yup
    .string()
    .required("Description is required")
    .min(5, "Description must be at least 5 characters long"),

  actionTaken: yup
    .string()
    .optional()
    .oneOf(Object.values(Enum.ActionTaken), "Invalid Action Taken"),

  supportingDocuments: yup.array().of(
    yup.object().shape({
      name: validateGroupFields(
        "name",
        "Document name is required",
        remarkGroupFields
      ),
      documentNumber: yup.string().optional(),
      url: validateGroupFields(
        "url",
        "Document is Required",
        remarkGroupFields
      ),
    })
  ),
});
