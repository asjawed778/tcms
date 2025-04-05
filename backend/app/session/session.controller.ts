import asyncHandler from "express-async-handler";
import { type Request, type Response } from "express";
import * as SessionService from "./session.service";
import createHttpError from "http-errors";
import { SessionStatus } from "./session.schema";
import { createResponse } from "../common/helper/response.hepler";


export const createSession = asyncHandler(async (req: Request, res: Response) => {
    const { startDate, endDate, sessionStatus } = req.body;
    const isSessionOverlapping = await SessionService.isSessionOverlapping(startDate, endDate);
    if (isSessionOverlapping) {
        throw createHttpError(400, "Session dates overlap with an existing session.");
    }
    if (sessionStatus === SessionStatus.CURRENT) {
        await SessionService.updateOtherCurrentSessionsToPast();
    }
    const sessionName = SessionService.generateSessionName(startDate, endDate);
    const sessionData = {
        session: sessionName,
        startDate,
        endDate,
        sessionStatus,
        deleted: false,
    };
    const newSession = await SessionService.createSession(sessionData);
    res.send(createResponse(newSession, "Session created successfully"));
});

export const updatedSession = asyncHandler(async (req: Request, res: Response) => {
    const { sessionId } = req.params;
    const { startDate, endDate, sessionStatus } = req.body;
    const isSessionOverlapping = await SessionService.isSessionOverlapping(startDate, endDate, sessionId);
    if (isSessionOverlapping) {
        throw createHttpError(400, "Session dates overlap with an existing session.");
    }
    const sessionName = SessionService.generateSessionName(startDate, endDate);
    if (sessionStatus === SessionStatus.CURRENT) {
        await SessionService.updateOtherCurrentSessionsToPast();
    }
    const sessionData = {
        session: sessionName,
        startDate,
        endDate,
        sessionStatus,
        deleted: false,
    };

    const updatedSession = await SessionService.updateSession(sessionId, sessionData);
    res.send(createResponse(updatedSession, "Session status updated successfully"));
});

export const getAllSession = asyncHandler(async (req: Request, res: Response) => {
    const sessions = await SessionService.getAllSession();
    res.send(createResponse(sessions, "All sessions fetched successfully"));
}); 

export const getSingleSession = asyncHandler(async (req: Request, res: Response) => {
    const { sessionId } = req.params;
    const session = await SessionService.getSessionById(sessionId);
    res.send(createResponse(session, "Session fetched successfully"));
});

export const deleteSession = asyncHandler(async (req: Request, res: Response) => {
    const { sessionId } = req.params;
    await SessionService.deleteSession(sessionId);
    res.send(createResponse({}, "Session deleted successfully"));
});

