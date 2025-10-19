import * as userService from "./user.service";
import * as UserDto from "./user.dto";
import * as jwthelper from "../common/helper/jwt.helper";
import { createResponse } from "../common/helper/response.hepler";
import asyncHandler from "express-async-handler";
import { type Request, type Response } from "express";
import createHttpError from "http-errors";
import { sendEmail } from "../common/services/email.service";
import { resetPasswordEmailTemplate } from "../common/template/mail.template";
import { loadConfig } from "../common/helper/config.hepler";

loadConfig();

const ACCESS_TOKEN_SECRET: string = process.env.ACCESS_TOKEN_SECRET as string;
const REFRESH_TOKEN_SECRET: string = process.env.REFRESH_TOKEN_SECRET as string;
const ADMIN_PORTAL_FE_URL: string = process.env.ADMIN_PORTAL_FE_URL as string;


// admin controllers
export const adminLogin = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) throw createHttpError(401, "Unauthorized");

  const role = req.user.role;

  const hasPermissions =
    role?.permissions?.some((perm: any) =>
      Object.values(perm.operations).includes(true)
    ) ?? false;

  if (!hasPermissions) {
    throw createHttpError(403, "Unauthorized to access admin dashboard");
  }

  const payload = {
    _id: req.user._id,
    name: req.user.name,
    email: req.user.email,
    role: {
      _id: req.user.role._id,
      name: req.user.role.name
    },
  };

  const { refreshToken, accessToken } = jwthelper.generateTokens(payload);

  const user: UserDto.IUserResponse | null = await userService.updateRefreshToken(
    req.user._id.toString(),
    refreshToken
  );

  if (!user) {
    throw createHttpError(500, "Failed to update refresh token, Login to continue");
  }

  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: false,
    sameSite: false,
  });
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: false,
    sameSite: false,
  });
  res.send(createResponse({ user, refreshToken, accessToken }, "LoggedIn successfully"));
});

export const logout = asyncHandler(async (req: Request, res: Response) => {
  const user = req.user;
  if (!user) {
    throw createHttpError(401, "User not found, please login again");
  }
  await userService.deleteRefreshToken(user._id);
  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");
  res.send(createResponse({}, "User logged out successfully"));
});

export const updatePassword = asyncHandler(async (req: Request, res: Response) => {
  const user = req.user;
  if (!user) {
    throw createHttpError(404, "User not found, please login again");
  }
  const data = req.body;
  await userService.updatePassword(user._id, data.oldPassword, data.newPassword);
  res.send(createResponse({}, "Password updated successfully"));
});

export const updateAccessToken = asyncHandler(async (req: Request, res: Response) => {
  const refreshToken = req.cookies.refreshToken || req.headers.authorization?.split(" ")[1];
  if (!refreshToken) {
    throw createHttpError(401, "Refresh token not found");
  }

  const { valid, decoded } = jwthelper.validateToken(
    refreshToken,
    REFRESH_TOKEN_SECRET
  );
  if (!valid || !decoded) {
    throw createHttpError(401, "Invalid refresh token, Please login again");
  }
  const payload: UserDto.Payload = decoded as UserDto.Payload;
  const user = await userService.getUserById(payload._id);
  if (!user) {
    throw createHttpError(404, "User not found");
  }
  const newPayload: UserDto.Payload = {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
  };
  const { accessToken, refreshToken: newRefreshToken } = jwthelper.generateTokens(newPayload);
  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });

  res.cookie("refreshToken", newRefreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });

  const result = await userService.updateRefreshToken(user._id, newRefreshToken);
  res.send(createResponse({ user: result, accessToken, refreshToken: newRefreshToken }, "Access token updated successfully"));
});

export const forgotPasswordSendToken = asyncHandler(async (req: Request, res: Response) => {
  const { email } = req.body;

  const user = await userService.getUserByEmail(email);
  if (!user) {
    throw createHttpError(404, "User not exists");
  }
  const resetToken = await jwthelper.generatePasswordRestToken(user._id);

  await userService.updateResetToken(user._id, resetToken);

  const resetLink = `${ADMIN_PORTAL_FE_URL}/reset-password/${resetToken}`;
  console.log("reset link: ", resetLink);

  const emailContent = resetPasswordEmailTemplate(resetLink);

  await sendEmail({
    to: email,
    subject: "Password reset Link",
    html: emailContent,
  });

  res.send(
    createResponse({}, "Reset password Link send successfully")
  );
});

export const resetPassword = asyncHandler(async (req: Request, res: Response) => {
  const { token } = req.params;
  const { newPassword } = req.body;

  const { valid, decoded } = await jwthelper.verifyResetPasswordToken(token as string);
  if (!valid || !decoded) {
    throw createHttpError(401, "Link is expired or invalid...");
  }
  await userService.resetPassword((decoded as any).userId, token, newPassword);
  res.send(createResponse(200, "Password reset successfully"));
});

// user roles and permissions
export const createRole = asyncHandler(async (req: Request, res: Response) => {
  const { name, description } = req.body;
  const role = await userService.createRole(name, description);
  res.send(createResponse(role, "Role created successfully"));
});

export const updateRole = asyncHandler(async (req: Request, res: Response) => {
  const roleId = req.params.roleId;
  const data = req.body;
  const role = await userService.updateRole(roleId, data);
  res.send(createResponse(role, "Role updated successfully"));
});

export const deleteRole = asyncHandler(async (req: Request, res: Response) => {
  const roleId = req.params.roleId;
  await userService.deleteRole(roleId);
  res.send(createResponse({}, "Role deleted successfully"));
});

export const getAllRoles = asyncHandler(async (req: Request, res: Response) => {
  const roles = await userService.getAllRoles();
  res.send(createResponse(roles, "All roles fetched successfully"));
});

export const getRoleById = asyncHandler(async (req: Request, res: Response) => {
  const roleId = req.params.roleId;
  const role = await userService.getRoleById(roleId);
  res.send(createResponse(role, "Role fetched successfully"));
});
