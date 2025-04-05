import asyncHandler from "express-async-handler";
import { type Request, type Response } from "express";

export const createClass = asyncHandler(async (req: Request, res: Response) => {
    // Your logic to create a class
    res.status(201).json({ message: "Class created successfully" });
});