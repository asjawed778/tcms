import { body, param, query } from 'express-validator';

export const login = [
    body('email')
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Invalid email format'),

    body('password')
        .notEmpty().withMessage('password is required')
        .isString().withMessage('password must be a string')
];

export const updatePassword = [
    body('oldPassword')
        .notEmpty().withMessage('Old password is required')
        .isString().withMessage('Old password must be a string'),

    body('newPassword')
        .notEmpty().withMessage('New password is required')
        .isString().withMessage('New password must be a string')
        .isLength({ min: 8 }).withMessage('New password must be at least 8 characters long')
        .matches(/[A-Z]/).withMessage('New password must contain at least one uppercase letter')
        .matches(/[a-z]/).withMessage('New password must contain at least one lowercase letter')
        .matches(/[0-9]/).withMessage('New password must contain at least one number')
        .matches(/[\W_]/).withMessage('New password must contain at least one special character'),
];

export const forgotPassword = [
    body('email')
        .notEmpty().withMessage('User email is required')
        .isString().withMessage('Email must be a string')
        .isEmail().withMessage('Invalid email format'),
];

export const resetPassword = [
    param('token')
        .notEmpty().withMessage('Token is required')
        .isString().withMessage('Token must be a string'),

    body('newPassword')
        .notEmpty().withMessage('New password is required')
        .isString().withMessage('New password must be a string')
        .isLength({ min: 8 }).withMessage('Password must be at least 8 characters long')
        .matches(/[A-Z]/).withMessage('Password must contain at least one uppercase letter')
        .matches(/[a-z]/).withMessage('Password must contain at least one lowercase letter')
        .matches(/\d/).withMessage('Password must contain at least one number')
        .matches(/[\W_]/).withMessage('Password must contain at least one special character'),
];


// user roles and permissions

export const createRole = [
    body('name')
        .notEmpty().withMessage('Role name is required')
        .isString().withMessage('Role name must be a string'),

    body('description')
        .optional()
        .isString().withMessage('Description must be a string'),
];


export const updateRole = [
    param('roleId')
        .notEmpty().withMessage('Role ID is required')
        .isMongoId().withMessage('Role ID must be a valid mongoId'),

    body("name")
        .optional()
        .isString()
        .withMessage("Role name must be a string"),

    body("description")
        .optional()
        .isString()
        .withMessage("Description must be a string"),

    body("permissions")
        .optional()
        .isArray()
        .withMessage("Permissions must be an array"),

    body("permissions.*.name")
        .optional()
        .isString()
        .withMessage("Permission module name must be a string"),

    body("permissions.*.operations")
        .optional()
        .isObject()
        .withMessage("Operations must be an object"),

    body("permissions.*.operations.create")
        .optional()
        .isBoolean()
        .withMessage("Create permission must be a boolean"),
    body("permissions.*.operations.read")
        .optional()
        .isBoolean()
        .withMessage("Read permission must be a boolean"),
    body("permissions.*.operations.update")
        .optional()
        .isBoolean()
        .withMessage("Update permission must be a boolean"),
    body("permissions.*.operations.delete")
        .optional()
        .isBoolean()
        .withMessage("Delete permission must be a boolean"),

    body("permissions.*.subModules")
        .optional()
        .isArray()
        .withMessage("SubModules must be an array"),

    body("permissions.*.subModules.*.name")
        .optional()
        .isString()
        .withMessage("SubModule name must be a string"),

    body("permissions.*.subModules.*.operations")
        .optional()
        .isObject()
        .withMessage("SubModule operations must be an object"),

    body("permissions.*.subModules.*.operations.create")
        .optional()
        .isBoolean()
        .withMessage("SubModule create permission must be a boolean"),
    body("permissions.*.subModules.*.operations.read")
        .optional()
        .isBoolean()
        .withMessage("SubModule read permission must be a boolean"),
    body("permissions.*.subModules.*.operations.update")
        .optional()
        .isBoolean()
        .withMessage("SubModule update permission must be a boolean"),
    body("permissions.*.subModules.*.operations.delete")
        .optional()
        .isBoolean()
        .withMessage("SubModule delete permission must be a boolean"),
];

export const deleteRole = [
    param('roleId')
        .notEmpty().withMessage('Role ID is required')
        .isMongoId().withMessage('Role ID must be a valid mongoId'),
];

export const getRoleById = [
    param('roleId')
        .notEmpty().withMessage('Role ID is required')
        .isMongoId().withMessage('Role ID must be a valid mongoId'),
];

export const getAllRoles = [
    query('page')
        .optional()
        .isInt({ min: 1 }).withMessage('Page must be a positive integer'),

    query('limit')
        .optional()
        .isInt({ min: 1 }).withMessage('Limit must be a positive integer'),

    query('search')
        .optional()
        .isString().withMessage('Search must be a string'),
];







