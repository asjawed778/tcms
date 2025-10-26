import { Router } from "express";
import { catchError } from "../common/middleware/cath-error.middleware";
import * as FaculytyController from "./employee.controller";
import * as FacultyValidation from "./employee.validation";
import * as Enum from "../common/utils/enum";
import { roleAuth } from "../common/middleware/role-auth.middleware";

const router = Router();

router
    .post(
        "/",
        roleAuth({ module: Enum.ModuleName.Employee, operation: Enum.Operation.CREATE }),
        FacultyValidation.createFaculty,
        catchError,
        // FaculytyController.createFaculty
    )
    .get(
        "/all",
        roleAuth({ module: Enum.ModuleName.Employee, operation: Enum.Operation.READ }),
        catchError,
        FaculytyController.getAllFaculty
    )
    .get(
        "/:facultyId",
        roleAuth({ module: Enum.ModuleName.Employee, operation: Enum.Operation.READ }),
        FacultyValidation.getFacultyById,
        catchError,
        FaculytyController.getFacultyById
    )
    .post(
        "/unassigned/:sessionId",
        roleAuth({ module: Enum.ModuleName.Employee, operation: Enum.Operation.READ }),
        FacultyValidation.getUnassignedFaculty,
        catchError,
        FaculytyController.getUnassignedFaculty
    )


export default router;
