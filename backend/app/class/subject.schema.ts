import mongoose from "mongoose";
import { ISubject } from "./class.dto";
import { SubjectCategory, SubjectType } from "./class.constants";

const subjectSchema = new mongoose.Schema<ISubject>({
    name: {
        type: String,
        required: true
    },
    publication: {
        type: String,
        required: false
    },
    writer: {
        type: String,
        required: false
    },
    ISBN: {
        type: String,
        required: false
    },
    subjectType: {
        type: String,
        enum: Object.values(SubjectType),
        required: true
    },
    subjectCategory: {
        type: String,
        enum: Object.values(SubjectCategory),
        required: true
    },
    deleted: {
        type: Boolean,
        default: false
    },
});

export default mongoose.model<ISubject>('Subject', subjectSchema);