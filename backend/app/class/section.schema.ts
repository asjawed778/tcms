
import mongoose from "mongoose";
import { ISection } from "./class.dto";

const sectionSchema = new mongoose.Schema<ISection>({
    name: {
        type: String,
        required: true,
        trim: true
    },
    classTeacher: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Faculty"
    },
    capacity: {
        type: Number,
        required: false
    },
    students: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student"
    }],
    deleted: {
        type: Boolean,
        default: false
    },
});

export default mongoose.model<ISection>("Section", sectionSchema);