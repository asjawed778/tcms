import createHttpError from "http-errors";
import { ISession, ISessionCreate } from "./session.dto";
import sessionSchema from "./session.schema";
import * as Enum from "../common/constant/enum";

export const updateOtherCurrentSessionsToPast = async () => {
    await sessionSchema.updateMany(
        { sessionStatus: Enum.SessionStatus.CURRENT },
        { sessionStatus: Enum.SessionStatus.PAST }
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
};

export const isSessionValid = async (sessionId: string) => {
    const isExists = await sessionSchema.exists({ _id: sessionId, deleted: false });
    return isExists;
}

export const isSessionCurrentOrFuture = async (sessionId: string) => {
    const session = await sessionSchema.findById(sessionId);
    if (!session) {
        throw createHttpError(404, "Session not found");
    }
    return session.sessionStatus === Enum.SessionStatus.CURRENT || session.sessionStatus === Enum.SessionStatus.UPCOMING;
}



