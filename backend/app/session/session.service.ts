import createHttpError from "http-errors";
import { ISession, ISessionCreate } from "./session.dto";
import sessionSchema, { SessionStatus } from "./session.schema";


export const updateOtherCurrentSessionsToPast = async () => {
    await sessionSchema.updateMany(
        { sessionStatus: SessionStatus.CURRENT },
        { sessionStatus: SessionStatus.PAST }
    );
};

export const getCurrentSession = (): string => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();

    if (month >= 3) return `${year}-${year + 1}`;
    return `${year - 1}-${year}`;
};

export const generateSessionName = (startDate: Date, endDate: Date): string => {
    const startYear = new Date(startDate).getFullYear();
    const endYear = new Date(endDate).getFullYear();
    return `${startYear}-${endYear}`;
};

export const isSessionOverlapping = async (
    newStartDate: Date,
    newEndDate: Date,
    sessionId?: string
): Promise<boolean> => {
    const query: any = {};
    if (sessionId) {
        query._id = { $ne: sessionId };
    }

    const allSessions = await sessionSchema.find(query);

    const newStart = new Date(newStartDate);
    const newEnd = new Date(newEndDate);

    for (const session of allSessions) {
        const existingStart = new Date(session.startDate);
        const existingEnd = new Date(session.endDate);

        const dateRangeOverlaps =
            newStart < existingEnd && newEnd > existingStart;

        let startsTooEarly = false;

        // Apply one-month check only if session years match
        if (newStart.getFullYear() === existingEnd.getFullYear()) {
            const oneMonthBeforeEnd = new Date(existingEnd);
            oneMonthBeforeEnd.setMonth(oneMonthBeforeEnd.getMonth() - 1);
            startsTooEarly = newStart < oneMonthBeforeEnd;
        }

        if (startsTooEarly || dateRangeOverlaps) {
            return true;
        }
    }

    return false;
};


export const createSession = async (data: ISessionCreate) => {
    const result = await sessionSchema.create(data);
    return result;
};

export const updateSession = async (id: string, sessionData: ISessionCreate) => {
    const result = await sessionSchema.findByIdAndUpdate(id, {...sessionData}, { new: true });
    if (!result) {
        throw createHttpError(404, "Session not found");
    }

    return result;
};

export const getAllSession = async () => {
    const result = await sessionSchema.find({deleted: false}).sort({ createdAt: -1 });
    return result;
};

export const getSessionById = async (id: string) => {
    const result = await sessionSchema.findById(id);
    return result;
};

export const deleteSession = async (id: string) => {
    const result = await sessionSchema.findByIdAndUpdate(id, { deleted: true }, { new: true });
    if (!result) {
        throw createHttpError(404, "Session not found");
    }
    return result;
}



