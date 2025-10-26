import mongoose from "mongoose";
import * as AcademicDto from "./academic.dto";
import * as Enum from "../common/utils/enum";

const feeDetailsSchema = new mongoose.Schema<AcademicDto.IFeeDetails>({
    feeType: {
        type: String,
        enum: Object.values(Enum.FeeType),
        required: true,
    },
    otherFeeType: {
        type: String,
        required: false,
    },
    amount: {
        type: Number,
        required: true,
    },
    isOptional: {
        type: Boolean,
        default: false,
    },
    applicableType: {
        type: String,
        enum: Object.values(Enum.FeeApplicableType),
        default: Enum.FeeApplicableType.RECURRING,
    },
    applicableFrequency: {
        type: String,
        enum: Object.values(Enum.FeeFrequency),
        required: false,
    },
}, { _id: false });


const frequencyWiseSchema = new mongoose.Schema<AcademicDto.IFrequencyWiseStructure>({
    frequency: {
        type: String,
        enum: Object.values(Enum.FeeFrequency),
        required: true,
    },
    feeDetails: [feeDetailsSchema],
    totalAmount: {
        type: Number,
        required: true,
    }
}, { _id: false });

const feeStructureSchema = new mongoose.Schema<AcademicDto.IFeeStructure>({
    classId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Class",
        required: true,
    },
    academicSession: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Session",
        required: true,
    },
    effectiveFrom: {
        type: Date,
        required: true,
    },
    structures: [frequencyWiseSchema],
    remarks: {
        type: String,
    },
    status: {
        type: String,
        enum: Object.values(Enum.ActiveStatus),
        default: Enum.ActiveStatus.ACTIVE,
    },
}, { timestamps: true });

export default mongoose.model<AcademicDto.IFeeStructure>("FeeStructure", feeStructureSchema);
