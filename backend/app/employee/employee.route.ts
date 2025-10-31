import { Router } from "express";
import { catchError } from "../common/middleware/cath-error.middleware";
import * as EmployeeController from "./employee.controller";
import * as EmployeeValidation from "./employee.validation";
import * as Enum from "../common/utils/enum";
import { roleAuth } from "../common/middleware/role-auth.middleware";

const router = Router();

router
    .post(
        "/add",
        roleAuth({ module: Enum.ModuleName.Employee, operation: Enum.Operation.CREATE }),
        EmployeeValidation.createEmployee,
        catchError,
        EmployeeController.createEmployee
    )
    .put(
        "/:employeeId/address",
        roleAuth({ module: Enum.ModuleName.Employee, operation: Enum.Operation.CREATE }),
        EmployeeValidation.employeeAddress,
        catchError,
        EmployeeController.upsertEmpAddress
    )
    .put(
        "/:employeeId/professional-details",
        roleAuth({ module: Enum.ModuleName.Employee, operation: Enum.Operation.CREATE }),
        EmployeeValidation.professionalDetails,
        catchError,
        EmployeeController.updateEmpProfessionalDetails
    )
    .put(
        "/:employeeId/salary-structure",
        roleAuth({ module: Enum.ModuleName.Employee, operation: Enum.Operation.CREATE }),
        EmployeeValidation.salaryStructure,
        catchError,
        EmployeeController.upsertSalaryStructure
    )
    .put(
        "/:employeeId/documents",
        roleAuth({ module: Enum.ModuleName.Employee, operation: Enum.Operation.CREATE }),
        EmployeeValidation.additionalDocuments,
        catchError,
        EmployeeController.upsertEmpDocuments
    )


    // old routes
    .get(
        "/all",
        roleAuth({ module: Enum.ModuleName.Employee, operation: Enum.Operation.READ }),
        catchError,
        EmployeeController.getAllFaculty
    )
    .get(
        "/:facultyId",
        roleAuth({ module: Enum.ModuleName.Employee, operation: Enum.Operation.READ }),
        EmployeeValidation.getFacultyById,
        catchError,
        EmployeeController.getFacultyById
    )
    .post(
        "/unassigned/:sessionId",
        roleAuth({ module: Enum.ModuleName.Employee, operation: Enum.Operation.READ }),
        EmployeeValidation.getUnassignedFaculty,
        catchError,
        EmployeeController.getUnassignedFaculty
    )


export default router;
