import React from "react";
import { useForm, FormProvider } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Box, Link, Stack } from "@mui/material";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";

import CustomInputField from "@/components/CustomInputField";
import CustomButton from "@/components/CustomButton";
import {
  ForgotPasswordFormValues,
  ResetPasswordFormValues,
} from "../../../type";
import { forgotPasswordSchema, resetPasswordSchema } from "../../../yup";
import {
  useForgotPasswordMutation,
  useResetPasswordMutation,
} from "@/services/authApi";
import { LockOutline, MailOutline } from "@mui/icons-material";

type Props = {
  onBackToLogin: () => void;
};
const ForgotPassword: React.FC<Props> = ({ onBackToLogin }) => {
  const { token } = useParams<{ token: string }>();
  console.log("Token: ", token);

  const mode: "forgot" | "reset" = token ? "reset" : "forgot";

  const [sendResetLink, { isLoading: sending }] = useForgotPasswordMutation();
  const [resetPassword, { isLoading: resetting }] = useResetPasswordMutation();

  const schema = mode === "forgot" ? forgotPasswordSchema : resetPasswordSchema;

  const methods = useForm<any>({
    resolver: yupResolver(schema as any),
  });

  const onSubmit = async (
    data: ForgotPasswordFormValues | ResetPasswordFormValues
  ) => {
    try {
      if (mode === "forgot") {
        const response = await sendResetLink(
          data as ForgotPasswordFormValues
        ).unwrap();
        toast.success(response.message || "Reset link sent to your email");
      } else {
        const response = await resetPassword({
          ...data,
          token,
        } as ResetPasswordFormValues & { token: string }).unwrap();
        toast.success(response.message || "Password has been reset!");
        // navigate("/login");
        onBackToLogin();
      }
    } catch (error: any) {
      const msg = error?.data?.message || "Something went wrong";
      toast.error(msg);
    }
  };

  return (
    <FormProvider {...methods}>
      <Box maxWidth="sm" mx="auto" px={{ xs: 2, md: 4 }} mt={6}>
        <form onSubmit={methods.handleSubmit(onSubmit)} noValidate>
          <Stack spacing={4}>
            {mode === "forgot" && (
              <CustomInputField
                type="email"
                name="email"
                label="Email"
                placeholder="Enter your registered email"
                startIcon={<MailOutline />}
              />
            )}
            {mode === "reset" && (
              <>
                <CustomInputField
                  type="password"
                  name="newPassword"
                  label="New Password"
                  placeholder="Enter new password"
                  startIcon={<LockOutline />}
                />
                <CustomInputField
                  type="password"
                  name="confirmPassword"
                  label="Confirm Password"
                  placeholder="Confirm new password"
                  startIcon={<LockOutline />}
                />
              </>
            )}
          </Stack>

          {mode === "forgot" && (
            <Box textAlign="right" mt={1}>
              <Link
                underline="hover"
                fontSize={14}
                onClick={onBackToLogin}
                color="secondary"
                sx={{ cursor: "pointer" }}
              >
                Back to Login
              </Link>
            </Box>
          )}

          <CustomButton
            type="submit"
            loading={sending || resetting}
            variant="contained"
            fullWidth
            sx={{ mt: 3 }}
          >
            {mode === "forgot" ? "Send Reset Link" : "Reset Password"}
          </CustomButton>
        </form>
      </Box>
    </FormProvider>
  );
};

export default ForgotPassword;
