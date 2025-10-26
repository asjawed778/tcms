import mongoose from "mongoose";
import { ISubject } from "./academic.dto";
import * as Enum from "../common/utils/enum";

const subjectSchema = new mongoose.Schema<ISubject>({
    name: {
        type: String,
        required: true
    },
    subjectId: {
        type: String,
        unique: true,
        required: true
    },
    sessionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Session",
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
        enum: Object.values(Enum.SubjectType),
        required: true
    },
    subjectCategory: {
        type: String,
        enum: Object.values(Enum.SubjectCategory),
        required: true
    },
    syllabus: {
        type: String,
        required: false
    },
});

export default mongoose.model<ISubject>('Subject', subjectSchema);