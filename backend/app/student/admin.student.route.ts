import { Router } from "express";
import { catchError } from "../common/middleware/cath-error.middleware";
import * as StudentController from "./student.controller";
import * as StudentValidation from "./student.validation";
import * as Enum from "../common/utils/enum";
import { roleAuth } from "../common/middleware/role-auth.middleware";

const router = Router();

router
  .post(
    "/add/step-1/personal-details",
    roleAuth({ module: Enum.ModuleName.STUDENTS, operation: Enum.Operation.CREATE }),
    StudentValidation.addStudentStep1,
    catchError,
    StudentController.addStudentStep1
  )
  .put(
    "/:studentId/step-2/address",
    roleAuth({ module: Enum.ModuleName.STUDENTS, operation: Enum.Operation.CREATE }),
    StudentValidation.addStudentStep2,
    catchError,
    StudentController.addStudentStep2
  )
  .put(
    "/:studentId/step-3/parent-details",
    roleAuth({ module: Enum.ModuleName.STUDENTS, operation: Enum.Operation.CREATE }),
    StudentValidation.addStudentStep3,
    catchError,
    StudentController.addStudentStep3
  )
  .put(
    "/:studentId/step-4/admission-details",
    roleAuth({ module: Enum.ModuleName.STUDENTS, operation: Enum.Operation.CREATE }),
    StudentValidation.addStudentStep4,
    catchError,
    StudentController.addStudentStep4
  )
  .put(
    "/:studentId/step-5/documents",
    roleAuth({ module: Enum.ModuleName.STUDENTS, operation: Enum.Operation.CREATE }),
    StudentValidation.addStudentStep5,
    catchError,
    StudentController.addStudentStep5
  )
  .post(
    "/bulk-upload",
    roleAuth({ module: Enum.ModuleName.STUDENTS, operation: Enum.Operation.CREATE }),
    StudentValidation.bulkAddStudents,
    catchError,
    StudentController.bulkUploadStudents
  )
  .get(
    "/all/:sessionId",
    roleAuth({ module: Enum.ModuleName.STUDENTS, operation: Enum.Operation.READ }),
    StudentValidation.getStudents,
    catchError,
    StudentController.getStudents
  )
  .get(
    "/details/:studentId",
    roleAuth({ module: Enum.ModuleName.STUDENTS, operation: Enum.Operation.READ }),
    StudentValidation.getStudentById,
    catchError,
    StudentController.getStudentById
  )

  // additional routes for student
  .post(
    "/remark/:sessionId/:studentId",
    roleAuth(),
    StudentValidation.addRemark,
    catchError,
    StudentController.addRemark
  );

export default router;
