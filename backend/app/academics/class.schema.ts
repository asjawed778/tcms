import mongoose from "mongoose";
import { IClass } from "./academic.dto";
import * as Enum from "../common/utils/enum";

const classSchema = new mongoose.Schema<IClass>({
    name: {
        type: String,
        enum: Object.values(Enum.ClassName),
        required: true
    },
    classId: {
        type: String,
        unique: true,
        required: true
    },
    session: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Session",
        required: true
    },
    courseStream: {
        type: String,
        enum: Object.values(Enum.CourseStream),
        default: Enum.CourseStream.GENERAL
    },
    status: {
        type: String,
        enum: Object.values(Enum.ClassStatus),
        default: Enum.ClassStatus.DRAFT
    }
}, { timestamps: true });

export default mongoose.model<IClass>('Class', classSchema);