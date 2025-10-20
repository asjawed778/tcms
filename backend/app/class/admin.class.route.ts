import { Router } from "express";
import { catchError } from "../common/middleware/cath-error.middleware";
import * as ClassControler from "./class.controller";
import * as ClassValidation from "./class.validation";
import * as Enum from "../common/utils/enum";
import { roleAuth } from "../common/middleware/role-auth.middleware";

const router = Router();

router
    .post(
        "/",
        roleAuth({ module: Enum.ModuleName.CLASSES, subModule: Enum.SubModuleName.CLASS, operation: Enum.Operation.CREATE }),
        ClassValidation.createClass,
        catchError,
        ClassControler.createClass
    )
    .get(
        "/all/:sessionId",
        roleAuth({ module: Enum.ModuleName.CLASSES, subModule: Enum.SubModuleName.CLASS, operation: Enum.Operation.READ }),
        ClassValidation.getAllClass,
        catchError,
        ClassControler.getAllClass
    )
    .get(
        "/:classId",
        roleAuth({ module: Enum.ModuleName.CLASSES, subModule: Enum.SubModuleName.CLASS, operation: Enum.Operation.READ }),
        ClassValidation.getClassById,
        catchError,
        ClassControler.getClassById
    )
    .patch(
        "/assign-faculty/:sessionId",
        roleAuth({ module: Enum.ModuleName.CLASSES, subModule: Enum.SubModuleName.CLASS, operation: Enum.Operation.UPDATE }),
        ClassValidation.assignFaculty,
        catchError,
        ClassControler.assignFaculty
    )
    .patch(
        "/remove-faculty/:sessionId",
        roleAuth({ module: Enum.ModuleName.CLASSES, subModule: Enum.SubModuleName.CLASS, operation: Enum.Operation.UPDATE }),
        ClassValidation.removeFaculty,
        catchError,
        ClassControler.removeAssignedTeacher
    )
    .post(
        "/timetable/:sessionId/:classId/:sectionId",
        roleAuth({ module: Enum.ModuleName.CLASSES, subModule: Enum.SubModuleName.TIMETABLE, operation: Enum.Operation.CREATE }),
        ClassValidation.createTimeTable,
        catchError,
        ClassControler.createTimeTable
    )
    .get(
        "/timetable/:sessionId/:classId/:sectionId",
        roleAuth({ module: Enum.ModuleName.CLASSES, subModule: Enum.SubModuleName.TIMETABLE, operation: Enum.Operation.READ }),
        ClassValidation.getTimeTableofClass,
        catchError,
        ClassControler.getTimeTableofClass
    )


export default router;
