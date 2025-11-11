import mongoose from "mongoose";
import * as Enum from "../common/utils/enum";
import { ITimeTable } from "./academic.dto";

const timeTableSchema = new mongoose.Schema<ITimeTable>({
    session: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Session",
        required: true,
    },
    class: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Class",
        required: true,
    },
    section: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Section",
        required: true,
    },
    weeklySchedule: [{
        day: {
            type: String,
            enum: Object.values(Enum.WeekDay),
            required: true,
        },
        periods: [{
            _id: false,
            periodType: {
                type: String,
                enum: Object.values(Enum.PeriodType),
                required: false,
            },
            periodNumber: {
                type: Number,
                required: false,
            },
            subject: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Subject",
                required: false,
            },
            faculty: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Employee",
                required: false,
            },
            room: {
                type: String,
                required: false,
            },
            timeSlot: {
                startTime: {
                    type: String,
                    required: true,
                    match: /^([01]\d|2[0-3]):([0-5]\d)$/
                },
                endTime: {
                    type: String,
                    required: true,
                    match: /^([01]\d|2[0-3]):([0-5]\d)$/
                },
                duration: {
                    type: String,
                    required: true,
                    match: /^PT(\d+H)?(\d+M)?$/
                },
            }
        }],
        isHoliday: {
            type: Boolean,
            default: false,
        },
        holidayReason: {
            type: String,
            required: false,
            trim: true,
        },
    }],
    effectiveFrom: {
        type: Date,
        default: Date.now,
    },
    effectiveTo: {
        type: Date,
        default: null
    },
    status: {
        type: String,
        enum: Object.values(Enum.TimeTableStatus),
        default: Enum.TimeTableStatus.DRAFT
    },
});

export default mongoose.model<ITimeTable>("TimeTable", timeTableSchema);

