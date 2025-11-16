import express from "express";
import { catchError } from "../common/middleware/cath-error.middleware";
import { roleAuth } from "../common/middleware/role-auth.middleware";
import * as EmployeeController from "./employee.controller";
import * as EmployeeValidation from "./employee.validation";
import * as Enum from "../common/utils/enum";

const router = express.Router();

router
    .post(
        "/basic-details",
        roleAuth({ module: Enum.ModuleName.Employee, operation: Enum.Operation.CREATE }),
        EmployeeValidation.createEmployee,
        catchError,
        EmployeeController.createEmployee
    )
    .put(
        "/:employeeId/basic-details",
        roleAuth({ module: Enum.ModuleName.Employee, operation: Enum.Operation.UPDATE }),
        EmployeeValidation.updateEmployeeBasicDetails,
        catchError,
        EmployeeController.updateEmployeeBasicDetails
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
    .get(
        "/all",
        roleAuth({ module: Enum.ModuleName.Employee, operation: Enum.Operation.READ }),
        EmployeeValidation.getAllEmployee,
        catchError,
        EmployeeController.getAllEmployee
    )
    .get(
        "/:employeeId",
        roleAuth({ module: Enum.ModuleName.Employee, operation: Enum.Operation.READ }),
        EmployeeValidation.getEmployeeById,
        catchError,
        EmployeeController.getEmployeeById
    )
    .get(
        "/:employeeId/salary-structure",
        roleAuth({ module: Enum.ModuleName.Employee, operation: Enum.Operation.READ }),
        EmployeeValidation.getEmployeeById,
        catchError,
        EmployeeController.getEmpSalaryStructure
    )
    .delete(
        "/:employeeId/delete-draft",
        roleAuth({ module: Enum.ModuleName.Employee, operation: Enum.Operation.DELETE }),
        EmployeeValidation.deleteDraftEmployee,
        catchError,
        EmployeeController.deleteDraftEmployee
    )

    // old routes


    .post(
        "/unassigned/:sessionId",
        roleAuth({ module: Enum.ModuleName.Employee, operation: Enum.Operation.READ }),
        EmployeeValidation.getUnassignedFaculty,
        catchError,
        EmployeeController.getUnassignedFaculty
    )


export default router;
