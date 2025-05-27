import mongoose from "mongoose";
import { IFaculty } from "./faculty.dto";
import * as Enum from "../common/constant/enum";


const facultySchema = new mongoose.Schema<IFaculty>({
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
        enum: Object.values(Enum.FacultyStatus),
        default: Enum.FacultyStatus.ACTIVE,
    }
}, { timestamps: true });


export default mongoose.model<IFaculty>("Faculty", facultySchema);
