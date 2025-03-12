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
    },
    feeStructure: {
        monthly: {
            amount: {
                type: Number,
                required: true
            },
            total: {
                type: Number,
                required: true
            }
        },
        quarterly: {
            amount: {
                type: Number,
                required: true
            },
            total: {
                type: Number,
                required: true
            }
        },
        halfYearly: {
            amount: {
                type: Number,
                required: true
            },
            total: {
                type: Number,
                required: true
            }
        },
        yearly: {
            amount: {
                type: Number,
                required: true
            },
            total: {
                type: Number,
                required: true
            }
        }
    }
});

export default mongoose.model<IClass>('Class', classSchema);