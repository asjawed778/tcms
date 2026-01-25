import mongoose from "mongoose";
import * as AdministrationDto from "./administration.dto";

const classNameSchema = new mongoose.Schema<AdministrationDto.IClassName>({
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    order: { type: Number, default: 1 },
    isActive: { type: Boolean, default: true },
}, { timestamps: true });

const periodTypeSchema = new mongoose.Schema<AdministrationDto.IPeriodType>({
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    isActive: { type: Boolean, default: true },
}, { timestamps: true });

export const ClassName = mongoose.model<AdministrationDto.IClassName>("ClassName", classNameSchema);
export const PeriodType = mongoose.model<AdministrationDto.IPeriodType>("PeriodType", periodTypeSchema);