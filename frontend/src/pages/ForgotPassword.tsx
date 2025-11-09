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
import toast from "react-hot-toast";

import CustomInputField from "@/components/CustomInputField";
import CustomButton from "@/components/CustomButton";
import { ForgotPasswordFormValues } from "../../type";
import { forgotPasswordSchema } from "../../yup";
import { useForgotPasswordMutation } from "@/services/authApi";
import { MailOutline } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import LoginVisuals from "./Login/LoginVisuals";


const ForgotPassword = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMdUp = useMediaQuery(theme.breakpoints.up("md"));

  const [sendResetLink, { isLoading }] = useForgotPasswordMutation();

  const methods = useForm<ForgotPasswordFormValues>({
    resolver: yupResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordFormValues) => {
    try {
      const response = await sendResetLink(data).unwrap();
      toast.success(response.message || "Reset link sent to your email");
    } catch (error: any) {
      const msg = error?.data?.message || "Something went wrong";
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
      {/* LEFT FORM SECTION */}
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
              Forgot Password?
            </Typography>
            <Typography
              variant="subtitle1"
              fontWeight={500}
              color="text.secondary"
              mb={4}
            >
              Enter your registered email
            </Typography>
          </Box>

          <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(onSubmit)} noValidate>
              <Stack spacing={4}>
                <CustomInputField
                  type="email"
                  name="email"
                  label="Email"
                  placeholder="Enter your registered email"
                  startIcon={<MailOutline />}
                />
              </Stack>

              <Box textAlign="right" mt={1}>
                <Link
                  underline="hover"
                  fontSize={14}
                  onClick={() => navigate("/login")}
                  color="secondary"
                  sx={{ cursor: "pointer" }}
                >
                  Back to Login
                </Link>
              </Box>

              <CustomButton
                type="submit"
                loading={isLoading}
                fullWidth
                sx={{ mt: 3 }}
              >
                Send Reset Link
              </CustomButton>
            </form>
          </FormProvider>
        </Box>
      </Box>

      {/* RIGHT SIDE PANEL (same as login) */}
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

export default ForgotPassword;
