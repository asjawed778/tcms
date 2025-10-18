import mongoose from "mongoose";
import { type IUser } from "./user.dto";
import * as Enum from "../common/constant/enum";


const userSchema = new mongoose.Schema<IUser>({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: Object.values(Enum.UserRole),
    default: Enum.UserRole.USER,
    required: true,
  },
  refreshToken: {
    type: String,
    default: null
  },
  resetPasswordToken: {
    type: String,
    default: null
  },
  active: {
    type: Boolean,
    default: true,
  },
  isLoginAllowed: {
    type: Boolean,
    default: true,
  },
}, { timestamps: true });

export default mongoose.model<IUser>("User", userSchema);
