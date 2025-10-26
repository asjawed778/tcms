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
        enum: Object.values(Enum.FacultyDesignation),
        required: true,
    },
    expertise: {
        type: [String],
        required: true,
    },
    qualification: {
        type: String,
        required: true,
    },
    certification: {
        type: String,
        required: false,
    },
    phoneNumber: {
        type: String,
        required: true
    },
    address: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Address",
        required: true,
    },
    dateOfJoining: {
        type: Date,
        required: true
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
        required: true
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
        default: Enum.EmployeeStatus.ACTIVE,
    }
}, { timestamps: true });


export default mongoose.model<IEmployee>("Employee", employeeSchema);
