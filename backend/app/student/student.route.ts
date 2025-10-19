import { Router } from "express";
import * as authMiddleware from "../common/middleware/auth.middleware";
import { catchError } from "../common/middleware/cath-error.middleware";
import * as StudentController from "./student.controller";
import * as StudentValidation from "./student.validation";
import * as Enum from "../common/constant/enum";

const router = Router();

router
  .post(
    "/add/step-1/personal-details",
    authMiddleware.auth,
    authMiddleware.roleAuth([Enum.UserRole.SUPER_ADMIN]),
    StudentValidation.addStudentStep1,
    catchError,
    StudentController.addStudentStep1
  )
  .put(
    "/:studentId/step-2/address",
    authMiddleware.auth,
    authMiddleware.roleAuth([Enum.UserRole.SUPER_ADMIN]),
    StudentValidation.addStudentStep2,
    catchError,
    StudentController.addStudentStep2
  )
  .put(
    "/:studentId/step-3/parents-details",
    authMiddleware.auth,
    authMiddleware.roleAuth([Enum.UserRole.SUPER_ADMIN]),
    StudentValidation.addStudentStep3,
    catchError,
    StudentController.addStudentStep3
  )
  .put(
    "/:studentId/step-3/admission-details",
    authMiddleware.auth,
    authMiddleware.roleAuth([Enum.UserRole.SUPER_ADMIN]),
    StudentValidation.addStudentStep4,
    catchError,
    StudentController.addStudentStep4
  )
  .put(
    "/:studentId/step-5/documents",
    authMiddleware.auth,
    authMiddleware.roleAuth([Enum.UserRole.SUPER_ADMIN]),
    StudentValidation.addStudentStep5,
    catchError,
    StudentController.addStudentStep5
  )
  .post(
    "/bulk-upload",
    authMiddleware.auth,
    authMiddleware.roleAuth([Enum.UserRole.SUPER_ADMIN]),
    StudentValidation.bulkAddStudents,
    catchError,
    StudentController.bulkUploadStudents
  )
  .get(
    "/all/:sessionId",
    authMiddleware.auth,
    authMiddleware.roleAuth([Enum.UserRole.SUPER_ADMIN]),
    StudentValidation.getStudents,
    catchError,
    StudentController.getStudents
  )
  .get(
    "/details/:studentId",
    authMiddleware.auth,
    authMiddleware.roleAuth([Enum.UserRole.SUPER_ADMIN]),
    StudentValidation.getStudentById,
    catchError,
    StudentController.getStudentById
  )
  .post(
    "/remark/:sessionId/:studentId",
    authMiddleware.auth,
    authMiddleware.roleAuth([
      Enum.UserRole.SUPER_ADMIN,
      Enum.UserRole.FACULTY,
      Enum.UserRole.PRINCIPAL,
      Enum.UserRole.ADMINISTRATOR,
    ]),
    StudentValidation.addRemark,
    catchError,
    StudentController.addRemark
  );

export default router;
