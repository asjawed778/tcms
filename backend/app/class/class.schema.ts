import mongoose from "mongoose";
import { IClass } from "./class.dto";
import { CourseStream } from "./class.constants";

const classSchema = new mongoose.Schema<IClass>({
    name: {
        type: String,
        required: true
    },
    session: {
        type: String,
        required: true
    },
    totalSection: {
        type: Number,
        required: true
    },
    sections : [{
        type: String,
        required: true
    }],
    subjects: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subject'
    }],
    courseStream: {
        type: String,
        enum: Object.values(CourseStream),
        required: false
    },
    classTeacher: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Teacher'
    }
});

export default mongoose.model<IClass>('Class', classSchema);