import { body } from "express-validator";

export const UpsertClassNameBulk = [
    body("classNames")
        .isArray({ min: 1 })
        .withMessage("classNames must be a non-empty array"),

    body("classNames.*._id")
        .optional()
        .isMongoId().withMessage("Class id(_id) must be a valid MongoId"),

    body("classNames.*.name")
        .trim()
        .notEmpty().withMessage("Class name is required"),

    body("classNames.*.slug")
        .trim()
        .notEmpty().withMessage("Slug is required")
        .isLowercase().withMessage("Slug must be lowercase")
        .matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).withMessage("Slug must be kebab-case (e.g. grade-1)"),

    body("classNames.*.order")
        .optional()
        .isInt({ min: 1 }).withMessage("Order must be a positive integer"),

    body("classNames.*.isActive")
        .optional()
        .isBoolean().withMessage("isActive must be boolean"),
];
