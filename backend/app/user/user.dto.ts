import { type BaseSchema } from "../common/dto/base.dto";
import * as Enum from "../common/constant/enum";

export interface IUser extends BaseSchema {
        name: string;
        email: string;
        role: Enum.UserRole;
        password: string;
        refreshToken: string;
        resetPasswordToken: string;
}
export interface IUserCreate {
        name: string;
        email: string;
        password: string;
        role?: Enum.UserRole;
}

export interface Payload {
        _id: string;
        name: string;
        email: string;
        role: Enum.UserRole;
}