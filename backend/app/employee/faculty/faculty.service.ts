import moment from "moment";
import * as UserService from "../../user/user.service";
import * as Enum from "../../common/utils/enum";
import employeeSchema from "../employee.schema";
import classTimetableSchema from "../../academics/class.timetable.schema";

export const getFreeFaculty = async (day: Enum.WeekDay, startTime: string, endTime: string) => {
    const requestedStart = moment(startTime, "HH:mm").subtract(5, "minutes").format("HH:mm");
    const requestedEnd = moment(endTime, "HH:mm").add(5, "minutes").format("HH:mm");

    const facultyRole = await UserService.getRoleByName(Enum.UserRole.FACULTY);
    if (!facultyRole) return [];

    const facultyEmployees = await employeeSchema.find()
        .populate<{
            user: { _id: string; firstName: string; lastName?: string; email: string } | null;
        }>({
            path: "user",
            match: { role: facultyRole._id },
            select: "_id firstName lastName email"
        });

    const filteredFaculty = facultyEmployees.filter(f => f.user && f.user.firstName);
    const facultyIds = filteredFaculty.map(f => f._id);

    const timetables = await classTimetableSchema.find({
        weeklySchedule: {
            $elemMatch: {
                day,
                isHoliday: false,
                periods: {
                    $elemMatch: {
                        faculty: { $in: facultyIds },
                        "timeSlot.startTime": { $lt: requestedEnd },
                        "timeSlot.endTime": { $gt: requestedStart }
                    }
                }
            }
        }
    });

    const result: any[] = [];

    filteredFaculty.forEach(f => {
        let busyInActive = false;
        let busyInDraft = false;

        timetables.forEach(tt => {
            tt.weeklySchedule?.forEach(ws => {
                if (ws.day !== day) return;
                if (!ws.periods || ws.periods.length === 0) return;

                ws.periods.forEach(p => {
                    if (p.faculty?.toString() !== f._id.toString()) return;

                    const overlap =
                        p.timeSlot.startTime < requestedEnd &&
                        p.timeSlot.endTime > requestedStart;

                    if (!overlap) return;

                    if (tt.status === "Active") busyInActive = true;
                    if (tt.status === "Draft") busyInDraft = true;
                });
            });
        });
        if (busyInActive) {
            return;
        }
        if (busyInDraft) {
            result.push({
                employeeId: f.employeeId,
                userId: f.user?._id,
                name: f.user?.firstName + (f.user?.lastName ? ` ${f.user?.lastName}` : ""),
                designation: f.designation ?? null,
                expertise: f.expertise ?? [],
                status: "Busy (Draft)"
            });
            return;
        }
        result.push({
            employeeId: f.employeeId,
            userId: f.user?._id,
            name: f.user?.firstName + (f.user?.lastName ? ` ${f.user?.lastName}` : ""),
            designation: f.designation ?? null,
            expertise: f.expertise ?? [],
            status: "Available"
        });
    });
    return result;
};
