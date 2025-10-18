import mongoose from "mongoose";
import { IClass } from "./class.dto";
import * as Enum from "../common/constant/enum";

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
        enum: Object.values(Enum.CourseStream),
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