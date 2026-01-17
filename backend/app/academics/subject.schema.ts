import mongoose from "mongoose";
import { ISubject, TextBook } from "./academic.dto";
import * as Enum from "../common/utils/enum";

const textBook = new mongoose.Schema<TextBook>({
    title: {
        type: String,
        required: true
    },
    coverPhoto: {
        type: String,
        required: false
    },
    publication: {
        type: String,
        required: false
    },
    author: {
        type: String,
        required: false
    },
    ISBN: {
        type: String,
        required: false
    },
}, { _id: false });

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
    classId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Class",
        required: true
    },
    sessionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Session",
        required: true
    },
    subjectType: {
        type: String,
        enum: Object.values(Enum.SubjectType),
        required: true
    },
    syllabus: {
        type: String,
        required: false
    },
    books: [textBook]
}, { timestamps: true });

export default mongoose.model<ISubject>('Subject', subjectSchema);