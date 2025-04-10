import { ITempUser, type IUser } from "./user.dto";
import UserSchema, { UserRole } from "./user.schema";
import bcrypt from 'bcrypt';
import * as jwthelper from '../common/helper/jwt.helper';
import createHttpError from "http-errors";
import TempUserSchema from "./tempUser.schema";
import { omit } from "lodash";
import { loadConfig } from "../common/helper/config.hepler";
import { ClientSession } from "mongoose";

loadConfig();

export const createUserByAdmin = async (data: {name: string, email: string, role: UserRole}, session?: ClientSession): Promise<Omit<ITempUser, "password">> => {
    const isUserExists = await UserSchema.findOne({ email: data.email });
    if (isUserExists) {
        throw createHttpError(409, "User already exists");
    }
    const password = `${data.name}@12345`;
    const hashedPass = await hashPassword(password);
    const profilePic = `${process.env.PROFILE_URL}${data.name}`;
    const [user] = await UserSchema.create([{ ...data, password: hashedPass, profilePic }], {session});
    return omit(user.toObject() as IUser, ["password"]);
};

const hashPassword = async (password: string) => {
    return await bcrypt.hash(password, 12);
};

const comparePassword = async (password: string, hash: string) => {
    return await bcrypt.compare(password, hash);
};

export const clearTempUser = async (email: string) => {
    await TempUserSchema.deleteMany({ email });
};

export const createTempUser = async (data: ITempUser): Promise<Omit<ITempUser, "password">> => {
    const hashedPass = await hashPassword(data.password);
    const result = await TempUserSchema.create({ ...data, password: hashedPass });

    return omit(result.toObject() as ITempUser, ["password"]);
};

export const getTempUserByEmail = async (email: string): Promise<ITempUser> => {
    const result = await TempUserSchema.findOne({ email }).lean();
    return result as ITempUser;
};

export const createUser = async (tempUser: ITempUser): Promise<Omit<IUser, "password" | "refreshToken" | "resetPasswordToken">> => {
    const profilePic = `${process.env.PROFILE_URL}${tempUser.name}`;
    const result = await UserSchema.create({ ...tempUser, profilePic });
    return omit(result.toObject() as IUser, ["password", "refreshToken", "resetPasswordToken"]);
};

export const authenticateUserByEmail = async (email: string, password: string): Promise<Omit<IUser, "password" | "refreshToken" | "resetPasswordToken">> => {
    const user = await UserSchema.findOne({ email });
    if (!user) {
        throw createHttpError(404, "User not found");
    }
    const isValidPassword = await comparePassword(password, user.password);
    if (!isValidPassword) {
        throw createHttpError(401, "Incorrect password");
    }
    return omit(user.toObject() as IUser, ["password", "refreshToken", "resetPasswordToken"]);
};

export const authenticateUserById = async (id: string, password: string): Promise<Omit<IUser, "password" | "refreshToken" | "resetPasswordToken">> => {
    const user = await UserSchema.findById(id);
    if (!user) {
        throw createHttpError(404, "User not found");
    }
    const isValidPassword = await comparePassword(password, user.password);
    if (!isValidPassword) {
        throw createHttpError(401, "Incorrect password");
    }
    return omit(user.toObject() as IUser, ["password", "refreshToken", "resetPasswordToken"]);
};

export const getUserByEmail = async (email: string) => {
    const result = await UserSchema.findOne({ email }).lean();
    return result as IUser;
};

export const updateRefreshToken = async (id: string, refreshToken: string): Promise<Omit<IUser, "password" | "refreshToken" | "resetPasswordToken"> | null>  => {
    const user = await UserSchema.findByIdAndUpdate(id,
        { refreshToken },
        { new: true }
    );
    return omit(user?.toObject() as IUser, ["password", "refreshToken", "resetPasswordToken"]);
};

export const getUserById = async (id: string) => {
    const result = await UserSchema.findById(id).lean();
    return result;
};

export const deleteRefreshToken = async (id: string): Promise<Omit<IUser, "password" | "refreshToken" | "resetPasswordToken"> | null> => {
    const user = await UserSchema.findByIdAndUpdate(id, { refreshToken: '' });
    return omit(user?.toObject() as IUser, ["password", "refreshToken", "resetPasswordToken"]);
};

export const updatePassword = async(userId: string, newPassword: string): Promise<Omit<IUser, "password" | "refreshToken" | "resetPasswordToken"> | null> => {
    
    const hashedPass = await hashPassword(newPassword);
     
    const user = await UserSchema.findByIdAndUpdate(userId, {password: hashedPass});
    return omit(user?.toObject() as IUser, ["password", "refreshToken", "resetPasswordToken"]);
};

export const updateResetToken = async(userId: string, token: string) => {
    await UserSchema.findByIdAndUpdate(userId, {resetPasswordToken: token});
};

export const resetPassword = async(userId: string, token: string, newPassword: string) => {
    const user = await UserSchema.findById(userId);
    if(!user?.resetPasswordToken) {
        throw createHttpError(401, "Token expired or invalid");
    }
    const hashPass = await bcrypt.hash(newPassword, 12);
    const newUser = await UserSchema.findByIdAndUpdate(userId, 
        {
            password: hashPass, resetPasswordToken: null
        }, {new: true}
    );

    return newUser;
};