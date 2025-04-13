import mongoose from "mongoose";
import { IClass } from "./class.dto";
import { CourseStream } from "./class.constants";

const classSchema = new mongoose.Schema<IClass>({
    name: {
        type: String,
        required: true
    },
    session: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Session",
        required: true
    },
    sections : [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Section"
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
    },
    deleted: {
        type: Boolean,
        required: true,
        default: false
    }
});

export default mongoose.model<IClass>('Class', classSchema);