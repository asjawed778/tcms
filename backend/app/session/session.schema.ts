import mongoose from "mongoose";
import { ISession } from "./session.dto";
import * as Enum from "../common/constant/enum";


const sessionSchema = new mongoose.Schema<ISession>({
    session: {
        type: String,
        required: true,
        unique: true
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    sessionStatus: {
        type: String,
        default: Enum.SessionStatus.UPCOMING,
        enum: Object.values(Enum.SessionStatus),
    },
    deleted: {
        type: Boolean,
        required: true,
        default: false
    }
}, { timestamps: true });

export default mongoose.model<ISession>('Session', sessionSchema);