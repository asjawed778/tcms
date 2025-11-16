import { Router } from "express";
import { catchError } from "../common/middleware/cath-error.middleware";
import * as StudentController from "./student.controller";
import * as StudentValidation from "./student.validation";
import * as Enum from "../common/utils/enum";
import { roleAuth } from "../common/middleware/role-auth.middleware";

const router = Router();

router
  .post(
    "/add/personal-details",
    roleAuth({ module: Enum.ModuleName.STUDENTS, operation: Enum.Operation.CREATE }),
    StudentValidation.addPersonalDetails,
    catchError,
    StudentController.addPersonalDetails
  )
  .put(
    "/:studentId/personal-details",
    roleAuth({ module: Enum.ModuleName.STUDENTS, operation: Enum.Operation.UPDATE }),
    StudentValidation.updatePersonalDetails,
    catchError,
    StudentController.updatePersonalDetails
  )
  .put(
    "/:studentId/address",
    roleAuth({ module: Enum.ModuleName.STUDENTS, operation: Enum.Operation.CREATE }),
    StudentValidation.upsertStudentAddress,
    catchError,
    StudentController.upsertStudentAddress
  )
  .put(
    "/:studentId/parent-details",
    roleAuth({ module: Enum.ModuleName.STUDENTS, operation: Enum.Operation.CREATE }),
    StudentValidation.upsertStudentParentsInfo,
    catchError,
    StudentController.upsertStudentParentsInfo
  )
  .put(
    "/:studentId/admission-details",
    roleAuth({ module: Enum.ModuleName.STUDENTS, operation: Enum.Operation.CREATE }),
    StudentValidation.upsertStudentAdmissinInfo,
    catchError,
    StudentController.upsertStudentAdmissinInfo
  )
  .put(
    "/:studentId/documents",
    roleAuth({ module: Enum.ModuleName.STUDENTS, operation: Enum.Operation.CREATE }),
    StudentValidation.studentAdditionalDoc,
    catchError,
    StudentController.studentAdditionalDoc
  )
  .post(
    "/bulk-upload",
    roleAuth({ module: Enum.ModuleName.STUDENTS, operation: Enum.Operation.CREATE }),
    StudentValidation.bulkAddStudents,
    catchError,
    StudentController.bulkUploadStudents
  )
  .get(
    "/all",
    roleAuth({ module: Enum.ModuleName.STUDENTS, operation: Enum.Operation.READ }),
    StudentValidation.getStudents,
    catchError,
    StudentController.getStudents
  )
  .get(
    "/:studentId/details",
    roleAuth({ module: Enum.ModuleName.STUDENTS, operation: Enum.Operation.READ }),
    StudentValidation.getStudentById,
    catchError,
    StudentController.getStudentById
  )
  .delete(
    "/:studentId/delete-draft",
    roleAuth({ module: Enum.ModuleName.STUDENTS, operation: Enum.Operation.DELETE }),
    StudentValidation.deleteDraftStudent,
    catchError,
    StudentController.deleteDraftStudent
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
