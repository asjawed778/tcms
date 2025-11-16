import React from "react";
import {
    Box,
    Typography,
    useTheme,
    useMediaQuery,
    Paper,
    Stack,
} from "@mui/material";
import { useForm, FormProvider } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import CustomInputField from "@/components/ui/CustomInputField";
import CustomButton from "@/components/ui/CustomButton";
import { LockOutline } from "@mui/icons-material";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";

import { ResetPasswordFormValues } from "../../type";
import { resetPasswordSchema } from "../validation/yup";
import { useResetPasswordMutation } from "@/services/authApi";
import AuthImageSlider from "@/components/common/AuthImageSlider";

const ResetPassword: React.FC = () => {
    const theme = useTheme();
    const navigate = useNavigate();
    const isMdUp = useMediaQuery(theme.breakpoints.up("md"));
    const { token } = useParams<{ token: string }>();

    const [resetPassword, { isLoading }] = useResetPasswordMutation();

    const methods = useForm<ResetPasswordFormValues>({
        resolver: yupResolver(resetPasswordSchema),
    });

    const onSubmit = async (data: ResetPasswordFormValues) => {
        try {
            const response = await resetPassword({
                ...data,
                token: String(token),
            }).unwrap();

            toast.success(response.message || "Password reset successful!");
            navigate("/login");
        } catch (error: any) {
            const msg = error?.data?.message || "Unable to reset password";
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
                            Reset Password
                        </Typography>
                        <Typography
                            variant="subtitle1"
                            fontWeight={500}
                            color="text.secondary"
                            mb={4}
                        >
                            Create a new secure password
                        </Typography>
                    </Box>

                    <FormProvider {...methods}>
                        <form onSubmit={methods.handleSubmit(onSubmit)} noValidate>
                            <Stack spacing={4}>
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
                            </Stack>

                            <CustomButton
                                type="submit"
                                loading={isLoading}
                                fullWidth
                                sx={{ mt: 3 }}
                            >
                                Reset Password
                            </CustomButton>
                        </form>
                    </FormProvider>
                </Box>
            </Box>

            {/* RIGHT SIDE PANEL */}
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
                    <AuthImageSlider />
                </Paper>
            </Box>
        </Box>
    );
};

export default ResetPassword;
