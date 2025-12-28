import * as yup from "yup";

export const employeeBasicDetailsSchema = yup.object({
  firstName: yup.string().required("First Name is required").trim(),
  phoneNumber: yup
    .string()
    .required("Phone Number is required")
    .matches(/^[6-9]\d{9}$/, "Enter a valid 10-digit Indian phone number")
    .length(10, "Phone number must be exactly 10 digits"),
  email: yup
    .string()
    .required("Email is required")
    .matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Enter a valid email address"),
  aadhaarNumber: yup
    .string()
    .optional()
    .matches(/^\d{12}$/, "Aadhaar must be exactly 12 digits")
    .length(12, "Aadhaar must be exactly 12 digits"),
  dob: yup.string().required("Date of Birth is required"),
  gender: yup.string().required("Gender is required"),
});
export const employeeAddressDetailsSchema = yup.object({
  address: yup.object({
    addressLine1: yup.string().required("Address Line 1 is required").trim(),
    country: yup.string().required("Country is required"),
    state: yup.string().required("State is required"),
    city: yup.string().required("City is required"),
    pincode: yup
      .string()
      .required("Pincode is required")
      .matches(/^\d{6}$/, "Pincode must be exactly 6 digits"),
  }),
});
export const employeeProfessionalDetailsSchema = yup.object({
  designation: yup.string().required("Designation is required").trim(),
  dateOfJoining: yup.string().required("Date of Joining is required"),
});
export const employeeSalaryStructureSchema = yup.object({
  basicPay: yup.string().required("Basic pay is required").trim(),
  effectiveFrom: yup.string().required("Date of effective from is required"),
});
