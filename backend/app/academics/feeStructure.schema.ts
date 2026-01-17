import mongoose from "mongoose";
import * as AcademicDto from "./academic.dto";
import * as Enum from "../common/utils/enum";

const feeDetailsSchema = new mongoose.Schema<AcademicDto.IFeeDetails>({
    feeType: {
        type: String,
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    isOptional: {
        type: Boolean,
        default: false,
    },
    billingFrequency: {
        type: String,
        enum: Object.values(Enum.FeeFrequency),
        required: false,
    },
}, { _id: false });

const classFeeStructureSchema = new mongoose.Schema<AcademicDto.IClassFeeStructure>({
    classId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Class",
        required: true,
    },
    session: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Session",
        required: true,
    },
    effectiveFrom: {
        type: Date,
        required: true,
    },
    feeDetails: [feeDetailsSchema],
    remarks: {
        type: String,
    },
    status: {
        type: String,
        enum: Object.values(Enum.ActiveStatus),
        default: Enum.ActiveStatus.ACTIVE,
    },
}, { timestamps: true });

export default mongoose.model<AcademicDto.IClassFeeStructure>("ClassFeeStructure", classFeeStructureSchema);
