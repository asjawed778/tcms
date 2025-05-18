import mongoose from "mongoose";
import * as Enum from "../common/constant/enum";
import { ITimeTable } from "./class.dto";

const timeTableSchema = new mongoose.Schema<ITimeTable>({
    session: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Session",
        required: true,
    },
    section: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Section",
        required: true,
    },
    class: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Class",
        required: true,
    },
    weeklySchedule: [{
        day: {
            type: String,
            enum: Object.values(Enum.WeekDay),
            required: true,
        },
        periods: [{
            periodType: {
                type: String,
                enum: Object.values(Enum.PeriodType),
                required: true,
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
                ref: "Faculty",
                required: false,
            },
            room: {
                type: String,
                required: false,
            },
            timeSlot: {
                start: {
                    hour: { type: Number, required: true },
                    minute: { type: Number, required: true }
                },
                end: {
                    hour: { type: Number, required: true },
                    minute: { type: Number, required: true }
                },
                durationMinutes: { type: Number, required: true }
            }
        }],
        isHoliday: {
            type: Boolean,
            default: false,
        },
        holidayReason: {
            type: String,
            default: "School Holiday",
        },
    }]
});

timeTableSchema.pre("save", function (next) {
    const doc = this as ITimeTable;

    doc.weeklySchedule.forEach(schedule => {
        if (Array.isArray(schedule.periods)) {
            schedule.periods.forEach(period => {
                const startHour = period.timeSlot.start.hour;
                const startMinute = period.timeSlot.start.minute;
                const endHour = period.timeSlot.end.hour;
                const endMinute = period.timeSlot.end.minute;

                const startTotalMinutes = startHour * 60 + startMinute;
                const endTotalMinutes = endHour * 60 + endMinute;
                const duration = endTotalMinutes - startTotalMinutes;

                period.timeSlot.durationMinutes = Math.max(0, duration);
            });
        }
    });

    next();
});

export default mongoose.model<ITimeTable>("TimeTable", timeTableSchema);

