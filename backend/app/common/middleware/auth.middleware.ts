import { loadConfig } from "../helper/config.hepler";
import { type NextFunction, type Request, type Response } from "express";
import asyncHandler from "express-async-handler";
import createHttpError from "http-errors";
import { Payload, type IUser } from "../../user/user.dto";
import UserSchema from "../../user/user.schema";
import { decodeAccessToken } from "../helper/jwt.helper";
import * as Enum from "../constant/enum";

loadConfig();
const ACCESS_TOKEN_SECRET: string = process.env.ACCESS_TOKEN_SECRET as string;
const REFRESH_TOKEN_SECRET: string = process.env.REFRESH_TOKEN_SECRET as string;


export const auth = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.accessToken || req.headers.authorization?.replace("Bearer ", "");

  if (!token || token === "null" || token === "undefined" || token.trim() === "") {
    throw createHttpError(401, "Token is required for authentication");
  }
  const user = await decodeAccessToken(token);

  if (!user) {
    throw createHttpError(401, {
      message: "Invalid or expired token",
    });
  }
  req.user = user as any;
  next();
});


export const roleAuth = (allowedRoles: Enum.UserRole[]) => {
  return asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;
    
    if (!user || !user.role) {
      throw createHttpError(401, "Unauthorized - User not authenticated");
    }
    if (!allowedRoles.includes(user.role)) {
      throw createHttpError(403, `Forbidden - Requires one of these roles: ${allowedRoles.join(', ')}`);
    }
    next();
  });
};
