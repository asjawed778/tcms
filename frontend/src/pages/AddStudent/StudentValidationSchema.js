
import * as yup from "yup";

export const StepOneSchema = yup.object({
  name: yup.string().required(" Name is required"),
class: yup.string().required("Class is required"),
});

export const StepTwoSchema = yup.object({
  email: yup.string().email("Invalid email").required("Email is required"),
  phone: yup.string().min(10, "Invalid phone number").required("Phone is required"),
});

export const StepThreeSchema = yup.object({
  password: yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
});

export const StepFourSchema = yup.object({
  password: yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
});

export const StepFiveSchema = yup.object({
  password: yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
});
