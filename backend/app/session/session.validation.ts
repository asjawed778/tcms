import { body, param } from 'express-validator';
import { SessionStatus } from './session.schema';

export const createSession = [
    body('startDate')
        .notEmpty().withMessage('Start date is required')
        .isISO8601().withMessage('Start date must be a valid ISO 8601 date'),

    body('endDate')
        .notEmpty().withMessage('End date is required')
        .isISO8601().withMessage('End date must be a valid ISO 8601 date')
        .custom((endDate, { req }) => {
            if (new Date(endDate) <= new Date(req.body.startDate)) {
                throw new Error('End date must be after start date');
            }
            return true;
        }),

    body('sessionStatus')
        .optional()
        .isIn(Object.values(SessionStatus)).withMessage(`Session status must be one of: ${Object.values(SessionStatus).join(', ')}`),
];

export const updateSession = [
    param('sessionId')
        .notEmpty().withMessage('Session ID is required')
        .isMongoId().withMessage('Session ID must be a valid MongoDB ObjectId'),

    ...createSession,
];

export const getSession = [
    param('sessionId')
        .notEmpty().withMessage('Session ID is required')
        .isMongoId().withMessage('Session ID must be a valid MongoDB ObjectId'),
];
