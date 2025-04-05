import { body } from 'express-validator';
import * as ClassEnum from './class.constants';

export const createClass = [
    body('name')
        .isString()
        .notEmpty()
        .withMessage('Class name is required and must be a string.'),

    body('session')
        .isString()
        .notEmpty()
        .withMessage('Session is required and must be a string.'),

    body('totalSection')
        .isInt({ min: 1 })
        .withMessage('Total sections must be a number greater than 0.'),

    body('courseStream')
        .optional()
        .isIn(Object.values(ClassEnum.CourseStream))
        .withMessage(`Course stream must be one of: ${Object.values(ClassEnum.CourseStream).join(', ')}`),

    body('classTeacher')
        .optional()
        .isMongoId()
        .withMessage('Class teacher must be a valid Mongo ID.'),

    body('feeStructure')
        .isObject().withMessage('Fee structure must be provided as an object.'),

    body('feeStructure.monthly.amount')
        .isNumeric()
        .withMessage('Monthly fee amount must be a number.'),
    body('feeStructure.monthly.total')
        .isNumeric()
        .withMessage('Monthly fee total must be a number.'),

    body('feeStructure.quarterly.amount')
        .isNumeric()
        .withMessage('Quarterly fee amount must be a number.'),
    body('feeStructure.quarterly.total')
        .isNumeric()
        .withMessage('Quarterly fee total must be a number.'),

    body('feeStructure.halfYearly.amount')
        .isNumeric()
        .withMessage('Half-yearly fee amount must be a number.'),
    body('feeStructure.halfYearly.total')
        .isNumeric()
        .withMessage('Half-yearly fee total must be a number.'),

    body('feeStructure.yearly.amount')
        .isNumeric()
        .withMessage('Yearly fee amount must be a number.'),
    body('feeStructure.yearly.total')
        .isNumeric()
        .withMessage('Yearly fee total must be a number.'),

    // Subjects Validation
    body('subjects')
        .isArray({ min: 1 })
        .withMessage('Subjects must be a non-empty array.'),

    body('subjects.*.name')
        .isString()
        .notEmpty()
        .withMessage('Each subject must have a name.'),

    body('subjects.*.publication')
        .optional()
        .isString()
        .withMessage('Publication must be a string.'),

    body('subjects.*.writer')
        .optional()
        .isString()
        .withMessage('Writer must be a string.'),

    body('subjects.*.ISBN')
        .optional()
        .isString()
        .withMessage('ISBN must be a string.'),

    body('subjects.*.subjectType')
        .isIn(Object.values(ClassEnum.SubjectType))
        .withMessage(`Subject type must be one of: ${Object.values(ClassEnum.SubjectType).join(', ')}`),

    body('subjects.*.subjectCategory')
        .isIn(Object.values(ClassEnum.SubjectCategory))
        .withMessage(`Subject category must be one of: ${Object.values(ClassEnum.SubjectCategory).join(', ')}`)
];
