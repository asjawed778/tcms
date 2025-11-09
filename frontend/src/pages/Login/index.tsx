import React from "react";
import {
  Box,
  Typography,
  useTheme,
  useMediaQuery,
  Paper,
  Link,
  Stack,
} from "@mui/material";
import { useForm, FormProvider } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import CustomInputField from "@/components/ui/CustomInputField";
import CustomButton from "@/components/ui/CustomButton";
import { MailOutline, LockOutline } from "@mui/icons-material";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useLoginUserMutation } from "@/services/authApi";
import { useAppDispatch } from "@/store/store";
import { login } from "@/store/reducers/authSlice";
import { LoginFormValues } from "../../../type";
import { loginSchema } from "../../validation/yup";
import LoginVisuals from "./LoginVisuals";

const Login: React.FC = () => {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const isMdUp = useMediaQuery(theme.breakpoints.up("md"));

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
        toast.error(response.message || "Invalid email or password");
      }
    } catch (err: any) {
      const msg = err?.data?.message || "Login failed. Try again.";
      toast.error(msg);
    }
  };

  return (
    <Box
      display="flex"
      flexDirection={isMdUp ? "row" : "column"}
      height="100vh"
      width="100%"
      bgcolor={theme.palette.background.default}
    >
      <Box
        flex={1}
        p={{ xs: 1 }}
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
      >
        <Box width="100%" maxWidth={400}>
          <Box sx={{ ml: 4 }}>
            <Typography variant="h3" fontWeight={700} mb={1}>
              Welcome back!
            </Typography>
            <Typography
              variant="subtitle1"
              fontWeight={500}
              color="text.secondary"
              mb={4}
            >
              The Central Modern School Teams
            </Typography>
          </Box>
          <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(onSubmit)} noValidate>
              <Stack spacing={4}>
                <CustomInputField
                  type="email"
                  name="email"
                  label="Email"
                  placeholder="Enter your username"
                  startIcon={<MailOutline />}
                />

                <CustomInputField
                  type="password"
                  name="password"
                  label="Password"
                  placeholder="Enter your password"
                  startIcon={<LockOutline />}
                />
              </Stack>

              <Box textAlign="right" mb={2} mt={1}>
                <Link
                  onClick={() => navigate("/forgot-password")}
                  underline="hover"
                  color="secondary"
                  fontSize={14}
                  sx={{ cursor: "pointer" }}
                >
                  Forgot Password?
                </Link>
              </Box>

              <CustomButton type="submit" loading={isLoading} fullWidth>
                LOGIN
              </CustomButton>
            </form>
          </FormProvider>
        </Box>
      </Box>

      <Box
        flex={1}
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <Paper
          elevation={0}
          sx={{
            width: "100%",
            height: "100%",
            bgcolor: "#e6f4ea",
            borderRadius: 0,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            px: 4,
            position: "relative",
          }}
        >
          <LoginVisuals />
        </Paper>
      </Box>
    </Box>
  );
};

export default Login;
