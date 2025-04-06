import mongoose from "mongoose";
import { IFaculty } from "./faculty.dto";
import * as FacultyEnum from "./faculty.constant";
import { Gender } from "../common/constant/constant";


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
    gender: {
        type: String,
        enum: Object.values(Gender),
        required: true,
    },
    dob: {
        type: Date,
        required: true,
    },
    address: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Address",
        required: true,
    },
    photoUrl: {
        type: String,
        required: false,
    },
    aadhaarNumber: {
        type: Number,
        required: true,
    },
    designation: {
        type: String,
        enum: Object.values(FacultyEnum.Designation),
        required: true,
    },
    joiningDate: {
        type: Date,
        required: true,
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
    },
    documents: [{
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
}, { timestamps: true });


facultySchema.pre("save", async function (next) {
    const doc = this as mongoose.Document & {
        isNew: boolean;
        employeeId: string;
    };

    if (doc.isNew && !doc.employeeId) {
        let unique = false;
        while (!unique) {
            const randomId = "TCMS" + Math.floor(10000000 + Math.random() * 90000000);
            const existing = await mongoose.models.Faculty.findOne({ employeeId: randomId });
            if (!existing) {
                doc.employeeId = randomId;
                unique = true;
            }
        }
    }

    next();
});


export default mongoose.model<IFaculty>("Faculty", facultySchema);
