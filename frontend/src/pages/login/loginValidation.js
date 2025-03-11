import * as Yup from "yup";

export const loginValidation = Yup.object().shape({
  username: Yup.string()
    .matches(/^[a-z0-9]+$/, "Only small letters and numbers are allow")
    .required("Username is required."),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters.")
    .matches(/[A-Z]/, "Must contain at least one uppercase letter.")
    .matches(/[a-z]/, "Must contain at least one lowercase letter.")
    .matches(/[0-9]/, "Must contain at least one number.")
    .matches(/[@$!%*?&]/, "Must contain at least one special character (@$!%*?&).")
    .required("Password is required."),
});
