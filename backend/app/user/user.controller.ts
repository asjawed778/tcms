import * as userService from "./user.service";
import { createResponse } from "../common/helper/response.hepler";
import asyncHandler from "express-async-handler";
import { type Request, type Response } from "express";
import createHttpError from "http-errors";
import { IUser, Payload } from "./user.dto";
import { sendEmail } from "../common/services/email.service";
import { resetPasswordEmailTemplate } from "../common/template/mail.template";
import * as jwthelper from "../common/helper/jwt.helper";
import { loadConfig } from "../common/helper/config.hepler";

loadConfig();

const ACCESS_TOKEN_SECRET: string = process.env.ACCESS_TOKEN_SECRET as string;
const REFRESH_TOKEN_SECRET: string = process.env.REFRESH_TOKEN_SECRET as string;
const BASE_URL: string = process.env.BASE_URL as string;


export const loginUser = asyncHandler(async (req: Request, res: Response) => {
  const data = req.body;

  const result: Omit<IUser, "password" | "refreshToken" | "resetPasswordToken"> = await userService.authenticateUserByEmail(data.email, data.password);

  const payload: Payload = {
    _id: result._id,
    name: result.name,
    email: result.email,
    role: result.role,
  };
    const { refreshToken, accessToken } = jwthelper.generateTokens(payload);
    const user: Omit<IUser, "password" | "refreshToken" | "resetPasswordToken"> | null = await userService.updateRefreshToken(
      result._id,
      refreshToken
    );
    if (!user) {
      throw createHttpError(
        500,
        "Failed to update refresh token, Login to continue"
      );
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

    res.send(createResponse({ user, refreshToken, accessToken }, "User LoggedIn successfully"));
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
    const payload: Payload = decoded as Payload;
    const user = await userService.getUserById(payload._id);
    if (!user) {
      throw createHttpError(404, "User not found");
    }
    const newPayload: Payload = {
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

    res.send(createResponse({user: result, accessToken, refreshToken: newRefreshToken}, "Access token updated successfully"));
  }
);

export const updatePassword = asyncHandler(async (req: Request, res: Response) => {
    const user = req.user;
    if (!user) {
      throw createHttpError(404, "User not found, please login again");
    }
    const isUser = await userService.getUserById(user._id);
    if (!isUser) {
      throw createHttpError(404, "User not found, please login again");
    }
    const data = req.body;
    const result = await userService.authenticateUserById(user._id, data.oldPassword);

    await userService.updatePassword(result._id, data.newPassword);

    res.send(createResponse({}, "Password updated successfully"));
  }
);

export const forgotPasswordSendToken = asyncHandler(async (req: Request, res: Response) => {
    const { email } = req.body;

    const user = await userService.getUserByEmail(email);
    if (!user) {
      throw createHttpError(404, "User not exists");
    }

    // Generate JWT for password reset, setting expiration time (e.g., 1 hour)
    const resetToken = await jwthelper.generatePasswordRestToken(user._id);

    await userService.updateResetToken(user._id, resetToken);

    const resetLink = `${BASE_URL}/reset-password/${resetToken}`;
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
  }
);

export const resetPassword = asyncHandler(
  async (req: Request, res: Response) => {
    const { token } = req.params;
    const { newPassword } = req.body;

    const { valid, decoded } = await jwthelper.verifyResetPasswordToken(token as string);
    if (!valid || !decoded) {
      throw createHttpError(401, "Link is expired or invalid...");
    }


    const user = await userService.resetPassword((decoded as any).userId, token, newPassword);

    res.send(createResponse(200, "Password reset successfully"));
  }
);
