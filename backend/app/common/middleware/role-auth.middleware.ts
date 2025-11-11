import { type NextFunction, type Request, type Response } from "express";
import expressAsyncHandler from "express-async-handler";
import createHttpError from "http-errors";
import { decodeAccessToken } from "../helper/jwt.helper";
import { IUserResponse } from "../../user/user.dto";
import { IModule } from "../../user/module.config";
import * as UserService from "../../user/user.service";
import { Operation, SubModuleName } from "../utils/enum";


interface PermissionCheckOptions {
  module: IModule["name"];
  subModule?: SubModuleName | "";
  operation: Operation;
  publicRoutes?: string[];
}


export const roleAuth = ({ module, subModule, operation, publicRoutes = [] }: PermissionCheckOptions = {} as PermissionCheckOptions) =>
  expressAsyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    if (publicRoutes.includes(req.path)) {
      return next();
    }
    const token = req.cookies.accessToken || req.headers.authorization?.replace("Bearer ", "");

    if (!token || token === "null" || token === "undefined" || token.trim() === "") {
      throw createHttpError(401, "Token is required for authentication");
    }

    const decoded = await decodeAccessToken(token);

    const user = await UserService.getUserById(decoded._id);
    if (!user || !user.role) {
      throw createHttpError(401, { message: "Invalid user or role" });
    }
    req.user = user as IUserResponse;
    if (!module || !operation) {
      return next();
    }

    const role = user.role as any;

    const permission = role.permissions.find((p: any) => p.name === module);

    if (!permission) {
      throw createHttpError(403, { message: `You are not authorized to perform this action` });
    }

    if (subModule) {
      const subPerm = permission.subModules?.find((s: any) => s.name === subModule);
      if (!subPerm || !subPerm.operations[operation]) {
        throw createHttpError(403, { message: `You are not authorized to perform this action` });
      }
    } else {
      if (!permission.operations[operation]) {
        throw createHttpError(403, { message: `You are not authorized to perform this action` });
      }
    }
    next();
  });

