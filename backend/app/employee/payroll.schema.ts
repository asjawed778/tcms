import mongoose from "mongoose";

const payrollSchema = new mongoose.Schema({
    employee: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Employee",
        required: true,
    },
    month: {
        type: String, 
        required: true,
    },
    salaryStructure: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "SalaryStructure",
    },
    workingDays: {
        type: Number,
        required: true,
    },
    presentDays: {
        type: Number,
        required: true,
    },
    grossSalary: {
        type: Number,
        required: true,
    },
    deductions: {
        type: Number,
        default: 0,
    },
    netSalary: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        enum: ["PENDING", "APPROVED", "PAID"],
        default: "PENDING",
    },
    paymentDate: {
        type: Date,
    },
    transactionId: {
        type: String,
    },
    remarks: {
        type: String,
    },
}, { timestamps: true });

export default mongoose.model("Payroll", payrollSchema);
