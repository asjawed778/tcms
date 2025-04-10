import mongoose from "mongoose";
import { IFaculty } from "./faculty.dto";
import * as FacultyEnum from "./faculty.constant";


const facultySchema = new mongoose.Schema<IFaculty>({
    employeeId: {
        type: String,
        required: true,
        unique: true,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    name: {
        type: String,
        required: true,
        trim: true,
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
    email: {
        type: String,
        unique: true,
        lowercase: true,
    },
    phoneNumber: {
        type: String,
        required: true,
        trim: true,
    },
    designation: {
        type: String,
        enum: Object.values(FacultyEnum.Designation),
        required: true,
    },
    expertiseSubjects: {
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
    status: {
        type: String,
        enum: Object.values(FacultyEnum.FacultyStatus),
        default: FacultyEnum.FacultyStatus.ACTIVE,
    }
}, { timestamps: true });


export default mongoose.model<IFaculty>("Faculty", facultySchema);
