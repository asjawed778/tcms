import * as yup from "yup";
import * as Enum from "@/utils/enum";
import { LoginFormValues } from "./type";
import { validateGroupFields } from "@/utils/helper";

// Login Schema.................................................
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
export const forgotPasswordSchema = yup.object().shape({
  email: yup
    .string()
    .email("Invalid email format")
    .matches(
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      "Email must include domain (e.g. gmail.com)"
    )
    .required("Email is required"),
});

export const resetPasswordSchema = yup.object().shape({
  newPassword: yup
    .string()
    .required("New Password is required")
    .min(8, "At least 8 characters")
    .matches(/[A-Z]/, "One uppercase letter required")
    .matches(/[0-9]/, "One number required")
    .matches(/[!@#$%^&*]/, "One special character required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("newPassword")], "Passwords not match")
    .required("Confirm password required"),
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

// Faculty Schema................................................
export const personalInfoSchema = yup.object({
  name: yup.string().required("Full name is required"),
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
        documentNumber: yup.string().optional(),
      })
    )
    .min(1, "At least one document is required"),
  salary: yup
    .string()
    .required("Salary is required")
    .matches(/^\d+$/, "Salary must be a number"),
});

// ClassSchema.........................................................
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
          .optional()
          // .typeError("Capacity must be a number")
          .positive("Capacity must be positive")
          .integer("Capacity must be an integer"),
      })
    ),
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

// Addmission Schema.....................................................
export const personalDetailsSchema = yup.object({
  name: yup.string().required("Name is required"),
  dob: yup
    .string()
    .matches(/^(\d{4})-(\d{2})-(\d{2})$/, "DOB must be a valid date")
    .required("Date of birth is required"),
  email: yup
    .string()
    .optional()
    .email("Invalid email format")
    .matches(
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      "Email must include domain (e.g. gmail.com)"
    ),
  contactNumber: yup
    .string()
    .optional()
    .matches(/^[0-9]{10}$/, "Enter a valid Indian phone number (10 digits)"),
  image: yup.string().required("Image is required"),
  gender: yup.string().required("Gender is required"),
  nationality: yup.string().required("Nationality is required"),
  religion: yup.string().required("Religion is required"),
  motherTongue: yup.string().required("Mother tongue is required"),
  bloodGroup: yup.string().optional(),
  adharNumber: yup
    .string()
    .length(12, "Aadhaar number must be 12 digits")
    .matches(/^\d{12}$/, "Aadhaar number must be numeric")
    .required("Aadhaar number is required"),
  address: yup.object().shape({
    addressLine1: yup.string().required("addressLine1 is required in address"),
    addressLine2: yup.string(),
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
      .email("Invalid email format")
      .matches(
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        "Email must include domain (e.g. gmail.com)"
      ),
    contactNumber: yup
      .string()
      .optional()
      .matches(/^[0-9]{10}$/, "Enter a valid Indian phone number (10 digits)"),
    qualification: yup.string().required("Qualification is required"),
    occupation: yup.string().required("Occupation is required"),
    bussinessOrEmployerName: yup.string().optional(),
    officeAddress: yup.string().optional(),
    officeNumber: yup.string().optional(),
  }),
  mother: yup.object({
    name: yup.string().required("Name is required"),
    email: yup
      .string()
      .optional()
      .email("Invalid email format")
      .matches(
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        "Email must include domain (e.g. gmail.com)"
      ),
    contactNumber: yup
      .string()
      .optional()
      .matches(/^[0-9]{10}$/, "Enter a valid Indian phone number (10 digits)"),
    qualification: yup.string().required("Qualification is required"),
    occupation: yup.string().required("Occupation is required"),
    bussinessOrEmployerName: yup.string().optional(),
    officeAddress: yup.string().optional(),
    officeNumber: yup.string().optional(),
  }),
  // localGuardian: yup.object({
  //   name: yup.string().optional(),
  //   email: yup
  //     .string()
  //     .optional()
  //     .email("Invalid email format")
  //     .matches(
  //       /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  //       "Email must include domain (e.g. gmail.com)"
  //     ),
  //   contactNumber: yup
  //     .string()
  //     .optional()
  //     .matches(/^[0-9]{10}$/, "Enter a valid Indian phone number (10 digits)"),
  //   qualification: yup.string().optional(),
  //   occupation: yup.string().optional(),
  //   bussinessOrEmployerName: yup.string().optional(),
  //   officeAddress: yup.string().optional(),
  //   officeNumber: yup.string().optional(),
  // }),
});

const groupedFields = [
  "name",
  "address",
  "reasonForLeaving",
  "dateOfLeaving",
  // "url",
];

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
        name: yup.string().required("Document name is required"),
        url: yup.string().required("Document file is required"),
        documentNumber: yup.string().optional(),
      })
    )
    .required("At least one document is required"),
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

// Time Table Schema............................................
// export const weeklySchema = yup.object().shape({
//   classId: yup.string().required("Class name is required"),
//   sectionId: yup.string().required("Section name is required"),
//   weeklySchedule: yup.array().of(
//     yup.object().shape({
//       isHoliday: yup.boolean(),
//       holidayReason: yup.string().when("isHoliday", {
//         is: true,
//         then: (schema) => schema.required("Holiday reason is required"),
//         otherwise: (schema) => schema.notRequired().strip(),
//       }),
//       periods: yup.array().of(
//         yup.object().shape({
//           periodType: yup
//             .string()
//             .oneOf(Object.values(Enum.PeriodType), "Invalid period type")
//             .required("Period type is required"),

//           periodNumber: yup
//             .number()
//             .typeError("Period number must be a number")
//             .positive("Must be a positive number")
//             .required("Period number is required"),

//           subject: yup.string().required("Subject is required"),
//           faculty: yup.string().required("Teacher is required"),
//           room: yup.string().optional(),

//           timeSlot: yup
//             .object({
//               start: yup
//                 .object({
//                   hour: yup
//                     .number()
//                     .transform((value, originalValue) =>
//                       originalValue === "" ? undefined : value
//                     )
//                     .typeError("Start hour must be a number")
//                     .min(1, "Start hour must be between 1 and 23")
//                     .max(23, "Start hour must be between 1 and 23")
//                     .required("Start hour is required"),

//                   minute: yup
//                     .number()
//                     .transform((value, originalValue) =>
//                       originalValue === "" ? undefined : value
//                     )
//                     .typeError("Start minute must be a number")
//                     .min(0, "Start minute must be between 0 and 59")
//                     .max(59, "Start minute must be between 0 and 59")
//                     .required("Start minute is required"),
//                 })
//                 .required("Start time is required"),

//               end: yup
//                 .object({
//                   hour: yup
//                     .number()
//                     .transform((value, originalValue) =>
//                       originalValue === "" ? undefined : value
//                     )
//                     .typeError("End hour must be a number")
//                     .min(1, "End hour must be between 1 and 23")
//                     .max(23, "End hour must be between 1 and 23")
//                     .required("End hour is required"),

//                   minute: yup
//                     .number()
//                     .transform((value, originalValue) =>
//                       originalValue === "" ? undefined : value
//                     )
//                     .typeError("End minute must be a number")
//                     .min(0, "End minute must be between 0 and 59")
//                     .max(59, "End minute must be between 0 and 59")
//                     .required("End minute is required"),
//                 })
//                 .required("End time is required"),
//             })
//             .required("Time slot is required"),
//         })
//       ),
//     })
//   ),
// });





const periodSchema = yup.object().shape({
  periodType: yup
    .string()
    .oneOf(Object.values(Enum.PeriodType), "Invalid period type")
    .required("Period type is required"),
  periodNumber: yup
    .number()
    .typeError("Period number must be a number")
    .positive("Must be a positive number")
    .required("Period number is required"),
  subject: yup.string().required("Subject is required"),
  faculty: yup.string().required("Teacher is required"),
  room: yup.string().optional(),
  timeSlot: yup
    .object({
      start: yup.object({
        hour: yup
          .number()
          .transform((value, originalValue) => (originalValue === "" ? undefined : value))
          .typeError("Start hour must be a number")
          .min(1, "Start hour must be between 1 and 23")
          .max(23, "Start hour must be between 1 and 23")
          .required("Start hour is required"),
        minute: yup
          .number()
          .transform((value, originalValue) => (originalValue === "" ? undefined : value))
          .typeError("Start minute must be a number")
          .min(0, "Start minute must be between 0 and 59")
          .max(59, "Start minute must be between 0 and 59")
          .required("Start minute is required"),
      }),
      end: yup.object({
        hour: yup
          .number()
          .transform((value, originalValue) => (originalValue === "" ? undefined : value))
          .typeError("End hour must be a number")
          .min(1, "End hour must be between 1 and 23")
          .max(23, "End hour must be between 1 and 23")
          .required("End hour is required"),
        minute: yup
          .number()
          .transform((value, originalValue) => (originalValue === "" ? undefined : value))
          .typeError("End minute must be a number")
          .min(0, "End minute must be between 0 and 59")
          .max(59, "End minute must be between 0 and 59")
          .required("End minute is required"),
      }),
    })
    .required("Time slot is required"),
});

export const daySchema = (dayIndex: number) => {
  return yup.object().shape({
    // Class/section only for first step
    ...(dayIndex === 0 && {
      classId: yup.string().required("Class name is required"),
      sectionId: yup.string().required("Section name is required"),
    }),
    
    // Current day's validation
    [`weeklySchedule.${dayIndex}`]: yup.object().shape({
      isHoliday: yup.boolean(),
      holidayReason: yup.string().when("isHoliday", {
        is: true,
        then: (schema) => schema.required("Holiday reason is required"),
        otherwise: (schema) => schema.notRequired(),
      }),
      periods: yup.array().when("isHoliday", {
        is: false,
        then: (schema) => schema.of(periodSchema).min(1, "At least one period is required"),
        otherwise: (schema) => schema.notRequired(),
      }),
    }),
  });
};
