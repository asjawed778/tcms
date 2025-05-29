import { type IUser } from "./user.dto";
import UserSchema from "./user.schema";
import bcrypt from 'bcrypt';
import createHttpError from "http-errors";
import { omit } from "lodash";
import { loadConfig } from "../common/helper/config.hepler";
import { ClientSession } from "mongoose";
import * as Enum from "../common/constant/enum";

loadConfig();

export const createUserByAdmin = async (data: { name: string, email: string, role: Enum.UserRole }, session?: ClientSession): Promise<Omit<IUser, "password">> => {
    const isUserExists = await UserSchema.findOne({ email: data.email });
    if (isUserExists) {
        throw createHttpError(409, "User already exists");
    }
    const password = `TCMS@12345`;
    const hashedPass = await hashPassword(password);
    const [user] = await UserSchema.create([{ ...data, password: hashedPass }], { session });
    return omit(user.toObject() as IUser, ["password"]);
};

const hashPassword = async (password: string) => {
    return await bcrypt.hash(password, 12);
};

const comparePassword = async (password: string, hash: string) => {
    return await bcrypt.compare(password, hash);
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

export const updateRefreshToken = async (id: string, refreshToken: string): Promise<Omit<IUser, "password" | "refreshToken" | "resetPasswordToken"> | null> => {
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

export const updatePassword = async (userId: string, newPassword: string): Promise<Omit<IUser, "password" | "refreshToken" | "resetPasswordToken"> | null> => {

    const hashedPass = await hashPassword(newPassword);

    const user = await UserSchema.findByIdAndUpdate(userId, { password: hashedPass });
    return omit(user?.toObject() as IUser, ["password", "refreshToken", "resetPasswordToken"]);
};

export const updateResetToken = async (userId: string, token: string) => {
    await UserSchema.findByIdAndUpdate(userId, { resetPasswordToken: token });
};

export const resetPassword = async (userId: string, token: string, newPassword: string) => {
    const user = await UserSchema.findById(userId);
    if (!user?.resetPasswordToken) {
        throw createHttpError(401, "Token expired or invalid");
    }
    const hashPass = await bcrypt.hash(newPassword, 12);
    const newUser = await UserSchema.findByIdAndUpdate(userId,
        {
            password: hashPass, resetPasswordToken: null
        }, { new: true }
    );

    return newUser;
};

export const isFaculty = async (userId: string) => {
    const user: IUser | null = await UserSchema.findById(userId);
    if (!user) {
        throw createHttpError(404, "User not found by this email");
    }
    if (user.role !== Enum.UserRole.FACULTY && user.role !== Enum.UserRole.PRINCIPAL) {
        return false;
    }
    return true;
};

export const getUnassignedFaculty = async (assignedFacultyIds: Set<string>) => {
    const unassignedFaculty = await UserSchema.find({
        role: Enum.UserRole.FACULTY,
        _id: { $nin: Array.from(assignedFacultyIds) }
    })
        .select("_id name email")
        .lean();

    return unassignedFaculty;
}