import { Types } from "mongoose";
import { type BaseSchema } from "../common/dto/base.dto";
import * as Enum from "../common/utils/enum";

export interface IUser extends BaseSchema {
        name: string;
        email: string;
        role: Types.ObjectId;
        password: string;
        refreshToken: string;
        resetPasswordToken: string;
        isActive: boolean;
        isLoginAllowed: boolean;
}
export interface IUserCreate {
        name: string;
        email: string;
        password: string;
        role: Types.ObjectId;
}
export interface IUserResponse extends Omit<IUser, "role" | "password" | "refreshToken" | "resetPasswordToken"> {
        role: IUserRole;
}
export interface IUserPopulated extends Omit<IUser, "role"> {
        role: IUserRole;
};

export interface Payload {
        _id: string;
        name: string;
        email: string;
        role: {
                _id: string;
                name: string;
        },
}

// user role and permisssin 
export interface IModule extends BaseSchema {
        name: Enum.ModuleName;
        subModules?: {
                name: Enum.SubModuleName;
        }[];
}

export interface IPermission {
        name: string;
        operations: {
                create: boolean;
                read: boolean;
                update: boolean;
                delete: boolean;
        };
        subModules?: IPermission[];
}

export interface IUserRole extends BaseSchema {
        name: string;
        description?: string;
        permissions: IPermission[];
}

export interface IUpdateRole extends Omit<IUserRole, "_id" | "createdAt" | "updatedAt"> { }

