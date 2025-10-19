import { type IUser } from "./user.dto";
import UserSchema from "./user.schema";
import bcrypt from 'bcrypt';
import createHttpError from "http-errors";
import { omit } from "lodash";
import { loadConfig } from "../common/helper/config.hepler";
import { ClientSession } from "mongoose";
import * as Enum from "../common/utils/enum";
import * as UserDto from "./user.dto";
import roleSchema from "./role.schema";
import moduleSchema from "./module.schema";
import { hashPassword, verifyPasswrod } from "../common/helper/jwt.helper";
import { DefaultRoles } from "../common/utils/constants";

loadConfig();



// old ones
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


export const updateResetToken = async (userId: string, token: string) => {
    await UserSchema.findByIdAndUpdate(userId, { resetPasswordToken: token });
};

export const isFaculty = async (userId: string) => {
    const user: IUser | null = await UserSchema.findById(userId);
    if (!user) {
        throw createHttpError(404, "User not found by this email");
    }
    // if (user.role !== Enum.UserRole.FACULTY && user.role !== ) {
    //     return false;
    // }
    return true;
};

export const getUnassignedFaculty = async (assignedFacultyIds: string[]) => {
    const unassignedFaculty = await UserSchema.find({
        role: Enum.UserRole.FACULTY,
        _id: { $nin: Array.from(assignedFacultyIds) }
    })
        .select("_id name email")
        .lean();

    return unassignedFaculty;
}
// old ones ene
// new ones

const getUserResponse = (user: UserDto.IUserPopulated) => {
    const { password, refreshToken, resetPasswordToken, ...rest } = user;
    const result = {
        ...rest,
        role: rest.role as unknown as UserDto.IUserRole,
    };
    return result as UserDto.IUserResponse;
};

export const getUserByEmail = async (email: string): Promise<UserDto.IUserPopulated | null> => {
    const user = await UserSchema.findOne({ email: email }).populate("role").lean<UserDto.IUserPopulated>();
    return user;
};

export const getUserById = async (id: string): Promise<UserDto.IUserPopulated | null> => {
    const user = await UserSchema.findById(id).populate("role").lean<UserDto.IUserPopulated>();
    return user;
};

export const createUser = async (
    data: UserDto.IUserCreate
): Promise<UserDto.IUserResponse> => {
    let hashedPass;
    if (data.password) {
        hashedPass = await hashPassword(data.password);
    }
    let userRole;
    if (!data.role) {
        userRole = await roleSchema.findOne({ name: Enum.UserRole.USER });
        if (!userRole) {
            throw createHttpError(500, "Default user role not found. Please contact admin.");
        }
    }

    const user = await UserSchema.create({
        ...data,
        role: data.role || userRole!._id,
        password: hashedPass,
    });
    const createdUser = await getUserById(user._id);

    if (!createdUser) {
        throw createHttpError(500, "Error fetching created user.");
    }
    const result: UserDto.IUserResponse = getUserResponse(createdUser);
    return result;
};

export const updateRefreshToken = async (
    id: string,
    refreshToken: string
): Promise<UserDto.IUserResponse | null> => {
    const user = await UserSchema.findByIdAndUpdate(
        id,
        { refreshToken },
        { new: true }
    ).populate("role").lean<UserDto.IUserPopulated>();

    if (!user) return null;
    const result: UserDto.IUserResponse = getUserResponse(user);
    return result;
};

export const updatePassword = async (userId: string, oldPassword: string, newPassword: string): Promise<Omit<IUser, "password" | "refreshToken" | "resetPasswordToken"> | null> => {
    const user = await getUserById(userId);
    if (!user) {
        throw createHttpError(404, "User not found");
    }
    const isPasswordValid = await verifyPasswrod(oldPassword, user.password);
    if (!isPasswordValid) {
        throw createHttpError(401, "Old password is incorrect");
    }
    const hashedPass = await hashPassword(newPassword);
    const result = await UserSchema.findByIdAndUpdate(userId, { password: hashedPass });
    return result;
};

export const deleteRefreshToken = async (id: string): Promise<Omit<IUser, "password" | "refreshToken" | "resetPasswordToken"> | null> => {
    const user = await UserSchema.findByIdAndUpdate(id, { refreshToken: '' });
    return omit(user?.toObject() as IUser, ["password", "refreshToken", "resetPasswordToken"]);
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

// user roles and permissions
export const createRole = async (name: string, description?: string) => {
    const existingRole = await roleSchema.findOne({ name });
    if (existingRole) {
        throw createHttpError(400, "Role with this name already exists");
    }

    const modules = await moduleSchema.find().lean();
    const permissions = modules.map(m => ({
        name: m.name,
        operations: {
            create: false,
            read: false,
            update: false,
            delete: false,
        },
        subModules: (m.subModules ?? []).map(s => ({
            name: s.name,
            operations: {
                create: false,
                read: false,
                update: false,
                delete: false,
            },
        })),
    }));

    const newRole = await roleSchema.create({ name, description, permissions });
    return newRole;
};

export const updateRole = async (roleId: string, updates: Partial<UserDto.IUserRole>) => {
    const role = await roleSchema.findById(roleId);
    if (!role) {
        throw createHttpError(404, "Role not found");
    }

    if (updates.name && updates.name !== role.name) {
        const existingRole = await roleSchema.findOne({
            name: updates.name,
            _id: { $ne: roleId },
        });
        if (existingRole) {
            throw createHttpError(400, "Role with this name already exists");
        }
        role.name = updates.name;
    }

    if (updates.description !== undefined) {
        role.description = updates.description;
    }

    if (updates.permissions) {
        updates.permissions.forEach((p: Partial<UserDto.IPermission>) => {
            const existingModule = role.permissions.find((m) => m.name === p.name);
            if (existingModule) {
                if (p.operations) {
                    existingModule.operations = {
                        ...existingModule.operations,
                        ...p.operations,
                    };
                }

                p.subModules?.forEach((s: Partial<UserDto.IPermission>) => {
                    const existingSub = existingModule.subModules?.find((sm) => sm.name === s.name);
                    if (existingSub && s.operations) {
                        existingSub.operations = {
                            ...existingSub.operations,
                            ...s.operations,
                        };
                    }
                });
            }
        });
    }

    await role.save();
    return role;
};

export const deleteRole = async (roleId: string) => {
    const role = await roleSchema.findById(roleId);
    if (!role) {
        throw createHttpError(404, "Role not found");
    }

    if (DefaultRoles.includes(role.name as Enum.UserRole)) {
        throw createHttpError(400, `${role.name} role cannot be deleted`);
    }

    const defaultUserRole = await roleSchema.findOne({ name: "User" });
    if (!defaultUserRole) {
        throw createHttpError(500, "Default User role not found");
    }

    await UserSchema.updateMany(
        { role: roleId },
        { $set: { role: defaultUserRole._id } }
    );

    await roleSchema.findByIdAndDelete(roleId);

    return true;
};

export const getAllRoles = async () => {
    const roles = await roleSchema
        .find({ name: { $nin: Enum.UserRole.ADMIN } })
        .lean();
    return roles;
};

export const getRoleById = async (roleId: string) => {
    const role = await roleSchema.findById(roleId).lean();
    if (!role) {
        throw createHttpError(404, "Role not found");
    }
    return role;
};

export const getRoleByName = async (roleName: string) => {
    const role = await roleSchema.findOne({ name: roleName }).lean();
    if (!role) {
        throw createHttpError(404, "Role not found");
    }
    return role;
};


