import mongoose from "mongoose";
import { ISalaryStructure } from "./employee.dto";

const salaryStructureSchema = new mongoose.Schema<ISalaryStructure>({
    employee: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Employee",
        required: true,
    },
    basicPay: {
        type: Number,
        required: true,
    },
    hra: {
        type: Number,
        default: 0,
    },
    allowances: {
        type: Number,
        default: 0,
    },
    deductions: {
        type: Number,
        default: 0,
    },
    effectiveFrom: {
        type: Date,
        required: true,
    },
    effectiveTo: {
        type: Date,
    },
    remarks: {
        type: String,
    }
}, { timestamps: true });

export default mongoose.model<ISalaryStructure>("SalaryStructure", salaryStructureSchema);
