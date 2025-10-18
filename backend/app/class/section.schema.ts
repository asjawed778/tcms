
import mongoose from "mongoose";
import { ISection } from "./class.dto";

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
    classTeacher: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    capacity: {
        type: Number,
        required: false
    },
    deleted: {
        type: Boolean,
        default: false
    },
});

export default mongoose.model<ISection>("Section", sectionSchema);