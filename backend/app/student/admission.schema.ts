import mongoose from "mongoose";
import * as Enum from "../common/constant/enum";
import { IAdmission } from "./student.dto";

const admissionSchema = new mongoose.Schema<IAdmission>({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student",
        required: true,
    },
    session: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Session",
        required: true,
    },
    class: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Class",
        required: true,
    },
    section: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Section",
        required: true,
    },
    rollNumber: {
        type: Number,
        required: true,
    },
    admissionStatus: {
        type: String,
        enum: Object.values(Enum.AdmissionStatus),
        default: Enum.AdmissionStatus.ACTIVE,
    },
    deleted: {
        type: Boolean,
        default: false,
    }
}, { timestamps: true, });

admissionSchema.pre("validate", async function (next) {
    if (this.isNew && !this.rollNumber) {
        const count = await mongoose.model<IAdmission>("Admission").countDocuments({
            session: this.session,
            class: this.class,
            section: this.section,
        });

        this.rollNumber = count + 1;
    }
    next();
});

export default mongoose.model<IAdmission>("Admission", admissionSchema);
