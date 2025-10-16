import React from "react";
import { useForm, FormProvider } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Box, Link, Stack } from "@mui/material";
import CustomInputField from "@/components/CustomInputField";
import { useLoginUserMutation } from "@/services/authApi";
import toast from "react-hot-toast";
import CustomButton from "@/components/CustomButton";
import { login } from "@/store/reducers/authReducer";
import { useNavigate } from "react-router-dom";
import { LockOutline, MailOutline } from "@mui/icons-material";
import { useAppDispatch } from "@/store/store";
import { LoginFormValues } from "../../../type";
import { loginSchema } from "../../../yup";

type Props = {
  onForgotPassword: () => void;
};
const LoginForm: React.FC<Props> = ({onForgotPassword }) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [loginUser, { isLoading }] = useLoginUserMutation();
  const methods = useForm<LoginFormValues>({
    resolver: yupResolver(loginSchema),
  });
  const onSubmit = async (data: LoginFormValues) => {
    try {
      const response = await loginUser(data).unwrap();

      const { user, accessToken, refreshToken } = response.data;
      if (response.success) {
        dispatch(
          login({
            user,
            accessToken,
            refreshToken,
          })
        );
        navigate("/dashboard");
        toast.success("Login successful!");
      } else {
        toast.error(response.message || "Invalid email or Password");
      }
    } catch (err: any) {
      console.error("Login error:", err);
      const msg = err?.data?.message || "Login failed. Try again.";
      toast.error(msg);
    }
  };

  return (
    <FormProvider {...methods}>
      <Box maxWidth="sm" mx="auto" px={{ xs: 2, md: 4 }}>
        <form onSubmit={methods.handleSubmit(onSubmit)} noValidate>
          <Stack spacing={4}>
            <Box>
              <CustomInputField
                type="email"
                name="email"
                label="Email"
                placeholder="Enter your username"
                startIcon={<MailOutline />}
              />
            </Box>
            <Box mb={2}>
              <CustomInputField
                type="password"
                name="password"
                label="Password"
                placeholder="Enter your password"
                startIcon={<LockOutline />}
              />
            </Box>
          </Stack>
          <Box textAlign="right" mb={2}>
            <Link
              onClick={onForgotPassword}
              underline="hover"
              color="secondary"
              fontSize={14}
              sx={{ cursor: "pointer" }}
            >
              Forgot Password?
            </Link>
          </Box>
          <CustomButton
            variant="contained"
            type="submit"
            loading={isLoading}
            fullWidth
          >
            submit
          </CustomButton>
        </form>
      </Box>
    </FormProvider>
  );
};
export default LoginForm;
