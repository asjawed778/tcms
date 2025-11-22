import mongoose from "mongoose";
import { IUserRole, IPermission } from "./user.dto";
import { RoleType } from "../common/utils/enum";

export const permissionSchema = new mongoose.Schema<IPermission>({
    name: { type: String, required: true, trim: true },
    operations: {
        create: { type: Boolean, default: false },
        read: { type: Boolean, default: false },
        update: { type: Boolean, default: false },
        delete: { type: Boolean, default: false },
    },
    subModules: [{
        name: { type: String, required: true, trim: true },
        operations: {
            create: { type: Boolean, default: false },
            read: { type: Boolean, default: false },
            update: { type: Boolean, default: false },
            delete: { type: Boolean, default: false },
        },
    }],
}, { _id: false });

const roleSchema = new mongoose.Schema<IUserRole>({
    name: { type: String, required: true, unique: true, trim: true },
    description: { type: String, trim: true },
    permissions: [permissionSchema],
    type: {
        type: String,
        enum: Object.values(RoleType),
        default: RoleType.CUSTOM,
    }
}, { timestamps: true });

export default mongoose.model<IUserRole>("Role", roleSchema);