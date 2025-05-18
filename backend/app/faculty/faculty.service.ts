import mongoose, { ClientSession } from "mongoose";
import * as FacultyDTO from "./faculty.dto";
import facultySchema from "./faculty.schema"
import * as Enum from "../common/constant/enum";
import { getTimeTableByDay } from "../class/class.service";

export const createFaculty = async (data: FacultyDTO.ICreateFaculty, session?: ClientSession) => {
    const [result] = await facultySchema.create([data], { session });
    return result as FacultyDTO.IFaculty;
};

export const getAllFaculty = async (
    page = 1,
    limit = 10,
    search?: string
) => {
    const query: any = {};

    if (search) {
        query.$or = [
            { name: { $regex: search, $options: "i" } },
            { employeeId: { $regex: search, $options: "i" } },
        ];
    }

    const totalDocuments = await facultySchema.countDocuments(query);
    const faculty = await facultySchema
        .find(query)
        .skip((page - 1) * limit)
        .limit(limit)
        .lean();

    return {
        currentPage: page,
        limit,
        totalDocuments,
        showing: faculty.length,
        faculty,
    };
};

export const getFacultyById = async (facultyId: string) => {
    const faculty = await facultySchema.findById(facultyId).lean();
    if (!faculty) {
        return null;
    }
    return faculty;
};


export const getUnassignedFaculty = async (
    sessionId: mongoose.Types.ObjectId,
    day: Enum.WeekDay,
    startTime: { hour: number; minute: number },
    endTime: { hour: number; minute: number }
) => {
    const startTotalMinutes = startTime.hour * 60 + startTime.minute;
    const endTotalMinutes = endTime.hour * 60 + endTime.minute;

    const timeTables = await getTimeTableByDay(sessionId, day);

    const assignedFacultyIds = new Set<string>();

    timeTables.forEach((timetable) => {
        timetable.weeklySchedule.forEach((schedule) => {
            if (schedule.day !== day) return;

            schedule.periods?.forEach((period) => {
                if (!period.faculty || !period.timeSlot) return;

                const periodStart = period.timeSlot.start.hour * 60 + period.timeSlot.start.minute;
                const periodEnd = period.timeSlot.end.hour * 60 + period.timeSlot.end.minute;

                const buffer = 5;
                const isOverlap = (startTotalMinutes - buffer) < periodEnd && periodStart < (endTotalMinutes + buffer);

                if (isOverlap && period.faculty) {
                    assignedFacultyIds.add(String(period.faculty));
                }
            });
        });
    });

    const unassignedFaculty = await facultySchema.find({
        _id: { $nin: Array.from(assignedFacultyIds) }
    }).select("_id name designation");

    return unassignedFaculty;
};

