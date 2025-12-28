import mongoose from "mongoose";
import { ISection } from "./academic.dto";

const sectionSchema = new mongoose.Schema<ISection>({
    name: {
        type: String,
        required: true,
        trim: true
    },
    sectionId: {
        type: String,   
        unique: true,
        required: true
    },
    sessionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Session",
        required: true,
    },
    classId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Class",
        required: true,
    },
    classTeacher: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    capacity: {
        type: Number,
        required: false
    },
}, { timestamps: true });

export default mongoose.model<ISection>("Section", sectionSchema);