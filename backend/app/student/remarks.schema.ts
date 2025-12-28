import mongoose from 'mongoose';
import { IRemark } from './student.dto';
import * as Enum from '../common/utils/enum';

const RemarkSchema = new mongoose.Schema<IRemark>({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',
        required: true
    },
    givenBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    class: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Class',
        required: true
    },
    section: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Section',
        required: true
    },
    date: {
        type: Date,
        default: Date.now,
        required: true
    },
    remarkType: {
        type: String,
        enum: Object.values(Enum.RemarkType),
        required: true
    },
    description: {
        type: String,
        required: true
    },
    actionTaken: {
        type: String,
        enum: Object.values(Enum.ActionTaken),
        required: false
    },
    supportingDocuments: [
        {
            name: { type: String, required: true },
            url: { type: String, required: true },
        }
    ],
    deleted: {
        type: Boolean,
        required: true,
        default: false
    }
}, { timestamps: true });

export default mongoose.model('Remark', RemarkSchema);
