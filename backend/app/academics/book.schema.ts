import mongoose from "mongoose";
import { IBook } from "./academic.dto";

const bookSchema = new mongoose.Schema<IBook>({
    title: {
        type: String,
        required: true
    },
    thumbnail: {
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
}, { timestamps: true });

export default mongoose.model<IBook>('Book', bookSchema);