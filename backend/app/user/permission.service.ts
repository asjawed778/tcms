import { MODULES_CONFIG } from "./module.config";
import moduleSchema from "./module.schema";
import roleSchema from "./role.schema";
import { IPermission } from "./user.dto";
import * as Enum from "../common/utils/enum";
import { DefaultRoles } from "../common/utils/constants";
import * as UserService from "./user.service";
import mongoose, { Types } from "mongoose";

const syncModules = async () => {
    const existingModules = await moduleSchema.find();
    const configModuleNames = MODULES_CONFIG.map(m => m.name);

    for (const existing of existingModules) {
        if (!configModuleNames.includes(existing.name)) {
            await moduleSchema.deleteOne({ name: existing.name });
            console.log(`❌ Removed outdated module: ${existing.name}`);
        }
    }
    for (const mod of MODULES_CONFIG) {
        let moduleDoc = await moduleSchema.findOne({ name: mod.name });

        if (!moduleDoc) {
            moduleDoc = new moduleSchema({
                name: mod.name,
                subModules: mod.subModules || [],
            });
            await moduleDoc.save();
            console.log(`Module created: ${mod.name}`);
        } else {
            let updated = false;
            mod.subModules?.forEach((sub) => {
                if (moduleDoc && Array.isArray(moduleDoc.subModules) && !moduleDoc.subModules.some((s) => s.name === sub.name)) {
                    moduleDoc.subModules.push({ name: sub.name });
                    updated = true;
                }
            });
            const configSubNames = mod.subModules?.map(s => s.name) || [];
            const filteredSubs = (moduleDoc.subModules || []).filter(s => configSubNames.includes(s.name));

            if (filteredSubs.length !== (moduleDoc.subModules || []).length) {
                moduleDoc.subModules = filteredSubs;
                updated = true;
            }
            if (updated) {
                await moduleDoc.save();
                console.log(`Module updated: ${mod.name}`);
            }
        }
    }
};

export const getAllPermissionsFromConfig = (): IPermission[] => {
    return MODULES_CONFIG.map((mod) => ({
        name: mod.name,
        operations: {
            create: false,
            read: false,
            update: false,
            delete: false,
        },
        subModules: mod.subModules?.map((sub) => ({
            name: sub.name,
            operations: {
                create: false,
                read: false,
                update: false,
                delete: false,
            },
        })) || [],
    }));
};

export const syncRolesAndPermissions = async () => {
    const allConfigPermissions = getAllPermissionsFromConfig();

    for (const roleName of DefaultRoles) {
        let role = await roleSchema.findOne({ name: roleName });

        if (!role) {
            role = new roleSchema({
                name: roleName,
                description: `${roleName} default role`,
                permissions: allConfigPermissions.map((perm) => ({
                    name: perm.name,
                    operations: {
                        create: roleName === Enum.UserRole.ADMIN,
                        read: roleName === Enum.UserRole.ADMIN,
                        update: roleName === Enum.UserRole.ADMIN,
                        delete: roleName === Enum.UserRole.ADMIN,
                    },
                    subModules: perm.subModules?.map((sub) => ({
                        name: sub.name,
                        operations: {
                            create: roleName === Enum.UserRole.ADMIN,
                            read: roleName === Enum.UserRole.ADMIN,
                            update: roleName === Enum.UserRole.ADMIN,
                            delete: roleName === Enum.UserRole.ADMIN,
                        },
                    })) || [],
                })),
            });
            await role.save();
        }
    }
    const allRoles = await roleSchema.find();

    for (const role of allRoles) {
        let updated = false;

        const configModuleNames = allConfigPermissions.map(p => p.name);
        const filteredPermissions = role.permissions.filter(p => configModuleNames.includes(p.name));
        if (filteredPermissions.length !== role.permissions.length) {
            role.permissions = filteredPermissions;
            updated = true;
            console.log(`❌ Removed outdated modules from role: ${role.name}`);
        }
        for (const configPerm of allConfigPermissions) {
            const existingPerm = role.permissions.find((p) => p.name === configPerm.name);

            if (!existingPerm) {
                role.permissions.push({
                    name: configPerm.name,
                    operations: {
                        create: role.name === Enum.UserRole.ADMIN,
                        read: role.name === Enum.UserRole.ADMIN,
                        update: role.name === Enum.UserRole.ADMIN,
                        delete: role.name === Enum.UserRole.ADMIN,
                    },
                    subModules: configPerm.subModules?.map((sub) => ({
                        name: sub.name,
                        operations: {
                            create: role.name === Enum.UserRole.ADMIN,
                            read: role.name === Enum.UserRole.ADMIN,
                            update: role.name === Enum.UserRole.ADMIN,
                            delete: role.name === Enum.UserRole.ADMIN,
                        },
                    })) || [],
                });
                updated = true;
                console.log(`🟢 Added missing module in role: ${role.name} → ${configPerm.name}`);
            } else {
                const configSubNames = configPerm.subModules?.map(s => s.name) || [];
                const filteredSubs = (existingPerm.subModules || []).filter(s => configSubNames.includes(s.name));
                if (filteredSubs.length !== (existingPerm.subModules || []).length) {
                    existingPerm.subModules = filteredSubs;
                    updated = true;
                    console.log(`❌ Removed outdated submodules from ${configPerm.name} in role: ${role.name}`);
                }
                for (const subConfig of configPerm.subModules || []) {
                    const existingSub = existingPerm.subModules?.find((s) => s.name === subConfig.name);
                    if (!existingSub) {
                        existingPerm.subModules = existingPerm.subModules || [];
                        existingPerm.subModules.push({
                            name: subConfig.name,
                            operations: {
                                create: role.name === Enum.UserRole.ADMIN,
                                read: role.name === Enum.UserRole.ADMIN,
                                update: role.name === Enum.UserRole.ADMIN,
                                delete: role.name === Enum.UserRole.ADMIN,
                            },
                        });
                        updated = true;
                        console.log(`🟢 Added missing submodule in ${configPerm.name} for role: ${role.name}`);
                    }
                }
            }
        }

        if (updated) {
            await role.save();
            console.log(`🔄 Role updated: ${role.name}`);
        }
    }
};

export const initAdmin = async () => {
    const email = process.env.NODE_ENV === "Production" ? "girish@girishganeriwala.com" : "akrtimes@gmail.com";

    const existingUser = await UserService.getUserByEmail(email);
    if (existingUser) {
        console.log("✅ Super Admin already exists:", existingUser.email);
        return;
    }
    const role = await UserService.getRoleByName(Enum.UserRole.ADMIN);
    console.log(role);
    if (!role) {
        console.error("❌ Admin role not found. Cannot create Super Admin user.");
        return;
    }
    const superAdmin = await UserService.createUser({
        name: "Super Admin",
        email,
        password: "Tcms@12345",
        role: new mongoose.Types.ObjectId(role._id),
    });
    console.log("🚀 Admin created successfully:", superAdmin.email);
};

export const initPermission = async () => {
    await syncModules();
    await syncRolesAndPermissions();
    await initAdmin();
    console.log("Permission initialization completed");
};
