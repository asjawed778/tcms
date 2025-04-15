import mongoose from "mongoose";
import { ISession } from "./session.dto";

export enum SessionStatus {
    CURRENT = 'Current',
    PAST = 'Past',
    UPCOMING = 'Upcoming'
}

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
        default: SessionStatus.UPCOMING,
        enum: Object.values(SessionStatus),
    },
    deleted: {
        type: Boolean,
        required: true,
        default: false
    }
}, { timestamps: true });

export default mongoose.model<ISession>('Session', sessionSchema);