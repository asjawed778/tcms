// import { Address, Document, Experience, LoginFormValues, SessionFormValues } from '@/type';
import * as yup from 'yup';
import * as Enum from "@/utils/enum";

import { LoginFormValues } from './type';

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
  startDate: yup
    .string()
    .required("Start date is required"),
  
  endDate: yup
    .string()
    .required("End date is required")
    .test("is-after-start", "End date must be after start date", function (value) {
      const { startDate } = this.parent;
      if (!startDate || !value) return true; // skip test if either is missing
      return new Date(value) > new Date(startDate);
    }),

  sessionStatus: yup
    .mixed<Enum.SessionStatus>()
    .oneOf(Object.values(Enum.SessionStatus) as Enum.SessionStatus[], "Invalid status")
    .required("Session status is required"),
});
// Faculty Schema...............
export const personalInfoSchema = yup.object({
  // name: yup.string().required('Name is required'),
  // photo: yup.string().required('Photo is required'),
  // fatherName: yup.string().required('Father name is required'),
  // motherName: yup.string().required('Mother name is required'),
  // email: yup
  //   .string()
  //   .email("Invalid email format")
  //   .matches(
  //     /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  //     "Email must include domain (e.g. gmail.com)"
  //   )
  //   .required("Email is required"),

  // phoneNumber: yup.string()
  //   .matches(/^[0-9]{10}$/, 'Enter a valid Indian phone number (10 digits)')
  //   .required('Phone number is required'),

  // gender: yup.string()
  //   .required('Gender is required'),

  // dob: yup.string()
  //   .matches(/^(\d{4})-(\d{2})-(\d{2})$/, 'DOB must be a valid date')
  //   .required('Date of birth is required'),

  // address: yup.object().shape({
  //   addressLine1: yup.string().required('addressLine1 is required in address'),
  //   addressLine2: yup.string(),
  //   city: yup.string().required('City is required '),
  //   state: yup.string().required('State is required '),
  //   country: yup.string().required('State is required '),
  //   pincode: yup.string()
  //     .matches(/^\d{6}$/, 'Enter a valid Indian pincode')
  //     .required('Pincode is required in address'),
  // }),
  // aadhaarNumber: yup.string()
  //   .length(12, 'Aadhaar number must be 12 digits')
  //   .matches(/^\d{12}$/, 'Aadhaar number must be numeric')
  //   .required('Aadhaar number is required'),
});



export const professionalInfoSchema = yup.object({
  expertiseSubjects: yup
  .array()
  .of(
    yup.object().shape({
      subject: yup.string().required("Subject is required"),
      // level: yup.string().required("Level is required"),
    })
  )
  .min(1, "At least one subject is required in Expertise Subjects")
  .required("Expertise subjects are required"),

  qualification: yup.string().required('Qualification is required'),
  // organizationName: yup.string().required('Qualification is required'),
  designation: yup.string().required('Designation is required'),
  dateOfJoining: yup.string()
    .matches(/^(\d{4})-(\d{2})-(\d{2})$/, 'Joining date must be a valid date')
    .required('Joining date is required'),
});

export const documentUploadSchema = yup.object({
  // documents: yup.array().of(
  //   yup.object().shape({
  //     name: yup.string().required("Document name is required"),
  //     url: yup.string().required("Document file is required"),
  //     documentNumber: yup
  //       .mixed()
  //       .test(
  //         "required",
  //         "Document Number is required",
  //         (value) => value !== null && value !== undefined && value !== ""
  //       ),
  //   })
  // ).min(1, "At least one document is required"),
});

