import mongoose from "mongoose";
import { IEmployee } from "./employee.dto";
import * as Enum from "../common/utils/enum";


const employeeSchema = new mongoose.Schema<IEmployee>({
    employeeId: {
        type: String,
        unique: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    fatherName: {
        type: String,
        required: false,
        trim: true,
    },
    motherName: {
        type: String,
        required: false,
        trim: true,
    },
    designation: {
        type: String,
        required: false,
    },
    expertise: {
        type: [String],
        required: false,
    },
    qualification: {
        type: String,
        required: false,
    },
    certification: {
        type: String,
        required: false,
    },
    phoneNumber: {
        type: String,
        required: false
    },
    address: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Address",
        required: false,
    },
    dateOfJoining: {
        type: Date,
        required: false
    },
    experience: [{
        organisationName: {
            type: String,
            required: true,
        },
        years: {
            type: Number,
            required: true,
        },
        designation: {
            type: String,
            required: true,
        },
    }],
    gender: {
        type: String,
        enum: Object.values(Enum.Gender)
    },
    dob: {
        type: Date,
        required: false
    },
    photo: {
        type: String,
        required: false
    },
    aadhaarNumber: {
        type: Number,
        required: false
    },
    documents: [{
        _id: false,
        name: {
            type: String,
            required: true,
        },
        documentNumber: {
            type: String,
            required: false,
        },
        url: {
            type: String,
            required: true,
        },
    }],
    status: {
        type: String,
        enum: Object.values(Enum.EmployeeStatus),
        default: Enum.EmployeeStatus.DRAFT,
    }
}, { timestamps: true });


export default mongoose.model<IEmployee>("Employee", employeeSchema);
