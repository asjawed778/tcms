import * as yup from "yup";
import * as Enum from "@/utils/enum";

import { LoginFormValues } from "./type";

export const loginSchema: yup.ObjectSchema<LoginFormValues> = yup.object({
  email: yup
    .string()
    .email("Invalid email format")
    .matches(
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      "Email must include domain (e.g. gmail.com)"
    )
    .required("Email is required"),
  password: yup
    .string()
    .required("Password is required")
    .min(8, "At least 8 characters")
    .matches(/[A-Z]/, "One uppercase letter required")
    .matches(/[0-9]/, "One number required")
    .matches(/[!@#$%^&*]/, "One special character required"),
});

export const sessionSchema = yup.object().shape({
  startDate: yup.string().required("Start date is required"),

  endDate: yup
    .string()
    .required("End date is required")
    .test(
      "is-after-start",
      "End date must be after start date",
      function (value) {
        const { startDate } = this.parent;
        if (!startDate || !value) return true; // skip test if either is missing
        return new Date(value) > new Date(startDate);
      }
    ),

  sessionStatus: yup
    .mixed<Enum.SessionStatus>()
    .oneOf(
      Object.values(Enum.SessionStatus) as Enum.SessionStatus[],
      "Invalid status"
    )
    .required("Session status is required"),
});

// Faculty Schema...............
export const personalInfoSchema = yup.object({
  // name: yup.string().required("Name is required"),
  photo: yup.string().required("Photo is required"),
  fatherName: yup.string().required("Father name is required"),
  motherName: yup.string().required("Mother name is required"),
  email: yup
    .string()
    .email("Invalid email format")
    .matches(
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      "Email must include domain (e.g. gmail.com)"
    )
    .required("Email is required"),

  phoneNumber: yup
    .string()
    .matches(/^[0-9]{10}$/, "Enter a valid Indian phone number (10 digits)")
    .required("Phone number is required"),

  gender: yup.string().required("Gender is required"),

  dob: yup
    .string()
    .matches(/^(\d{4})-(\d{2})-(\d{2})$/, "DOB must be a valid date")
    .required("Date of birth is required"),

  address: yup.object().shape({
    addressLine1: yup.string().required("addressLine1 is required in address"),
    addressLine2: yup.string(),
    city: yup.string().required("City is required "),
    state: yup.string().required("State is required "),
    country: yup.string().required("State is required "),
    pincode: yup
      .string()
      .matches(/^\d{6}$/, "Enter a valid Indian pincode")
      .required("Pincode is required in address"),
  }),
  aadhaarNumber: yup
    .string()
    .length(12, "Aadhaar number must be 12 digits")
    .matches(/^\d{12}$/, "Aadhaar number must be numeric")
    .required("Aadhaar number is required"),
});

export const professionalInfoSchema = yup.object({
  expertiseSubjects: yup
    .array()
    .of(
      yup.object().shape({
        subject: yup.string().required("Subject is required"),
      })
    )
    .min(1, "At least one subject is required in Expertise Subjects")
    .required("Expertise subjects are required"),

  qualification: yup.string().required("Qualification is required"),
  designation: yup.string().required("Designation is required"),
  dateOfJoining: yup
    .string()
    .matches(/^(\d{4})-(\d{2})-(\d{2})$/, "Joining date must be a valid date")
    .required("Joining date is required"),

  experience: yup
    .array()
    .of(
      yup.object().shape({
        organisationName: yup
          .string()
          .test("org-required", "Organisation is required", function (value) {
            const { designation, years } = this.parent;
            return !!value?.trim() || (!designation?.trim() && !years);
          }),

        designation: yup
          .string()
          .test(
            "designation-required",
            "Designation is required",
            function (value) {
              const { organisationName, years } = this.parent;
              return !!value?.trim() || (!organisationName?.trim() && !years);
            }
          ),

        years: yup
          .number()
          .transform((v, o) => (o === "" ? undefined : v))
          .nullable()
          .test(
            "years-required",
            "Experience years is required",
            function (value) {
              const { organisationName, designation } = this.parent;
              return (
                (value !== undefined && value !== null) ||
                (!organisationName?.trim() && !designation?.trim())
              );
            }
          )
          .typeError("Years must be a number"),
      })
    )
    .min(1, "At least one experience entry is required"),
});

export const documentUploadSchema = yup.object({
  documents: yup
    .array()
    .of(
      yup.object().shape({
        name: yup.string().required("Document name is required"),
        url: yup.string().required("Document file is required"),
        documentNumber: yup
          .mixed()
          .test(
            "required",
            "Document Number is required",
            (value) => value !== null && value !== undefined && value !== ""
          ),
      })
    )
    .min(1, "At least one document is required"),
  salary: yup
    .string()
    .required("Salary is required")
    .matches(/^\d+$/, "Salary must be a number"),
});

// ClassSchema.............................
export const basicDetailsSchema = yup.object({
  name: yup.string().required("Class name is required"),
  courseStream: yup.string().optional(),
  sections: yup
    .array()
    .min(1, "At least one section is required")
    .of(
      yup.object().shape({
        name: yup.string().required("Section name is requied"),
        capacity: yup
          .number()
          .transform((value, originalValue) =>
            originalValue === "" ? undefined : value
          )
          .required("Capacity is required")
          .typeError("Capacity must be a number")
          .positive("Capacity must be positive")
          .integer("Capacity must be an integer"),
        })
        
    )
});
export const feeStructureSchema = yup.object({
  feeStructure: yup.object().shape({
    monthly: yup.object().shape({
      amount: yup
        .number()
        .typeError("Amount must be a number")
        .required("Monthly amount is required")
        .positive("Amount must be positive")
        .integer("Amount must be an integer"),

      total: yup
        .number()
        .typeError("Amount must be a number")
        .required("Monthly amount is required")
        .positive("Amount must be positive")
        .integer("Amount must be an integer"),
    }),
    quarterly: yup.object().shape({
      amount: yup
        .number()
        .required("Monthly amount is required")
        .typeError("Amount must be a number")
        .positive("Amount must be positive")
        .integer("Amount must be an integer"),

      total: yup
        .number()
        .typeError("Total amount must be a number")
        .required("Total amount is required")
        .positive("Total amount must be positive")
        .integer("Total amount must be an integer"),
    }),
    halfYearly: yup.object().shape({
      amount: yup
        .number()
        .required("Monthly amount is required")
        .typeError("Amount must be a number")
        .positive("Amount must be positive")
        .integer("Amount must be an integer"),

      total: yup
        .number()
        .typeError("Total amount must be a number")
        .required("Total amount is required")
        .positive("Total amount must be positive")
        .integer("Total amount must be an integer"),
    }),
    yearly: yup.object().shape({
      amount: yup
        .number()
        .typeError("Amount must be a number")
        .required("Monthly amount is required")
        .positive("Amount must be positive")
        .integer("Amount must be an integer"),

      total: yup
        .number()
        .typeError("Total amount must be a number")
        .required("Total amount is required")
        .positive("Total amount must be positive")
        .integer("Total amount must be an integer"),
    }),
  }),
});
