import mongoose from "mongoose";
import { type IUser } from "./user.dto";


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
    type: mongoose.Schema.Types.ObjectId,
    ref: "Role",
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
  isActive: {
    type: Boolean,
    default: true,
  },
  isLoginAllowed: {
    type: Boolean,
    default: true,
  },
}, { timestamps: true });

export default mongoose.model<IUser>("User", userSchema);
