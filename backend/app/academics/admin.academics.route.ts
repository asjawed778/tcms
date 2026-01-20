import { Router } from "express";
import { catchError } from "../common/middleware/cath-error.middleware";
import * as ClassControler from "./academic.controller";
import * as AcademicValidation from "./academics.validation";
import * as Enum from "../common/utils/enum";
import { roleAuth } from "../common/middleware/role-auth.middleware";

const router = Router();

router
    // subject routes - need to review and deleted
    .put(
        "/subject/:subjectId",
        roleAuth({ module: Enum.ModuleName.ACADEMICS, subModule: Enum.SubModuleName.SUBJECTS, operation: Enum.Operation.UPDATE }),
        AcademicValidation.editSubject,
        catchError,
        ClassControler.editSubject
    )
    .delete(
        "/subject/:subjectId",
        roleAuth({ module: Enum.ModuleName.ACADEMICS, subModule: Enum.SubModuleName.SUBJECTS, operation: Enum.Operation.DELETE }),
        AcademicValidation.deleteSubject,
        catchError,
        ClassControler.deleteSubject
    )

    // section routes
    .delete(
        "/section/:sectionId",
        roleAuth({ module: Enum.ModuleName.ACADEMICS, subModule: Enum.SubModuleName.SECTION, operation: Enum.Operation.DELETE }),
        AcademicValidation.deleteSection,
        catchError,
        ClassControler.deleteSection
    )


    // class routes
    .post(
        "/class",
        roleAuth({ module: Enum.ModuleName.ACADEMICS, subModule: Enum.SubModuleName.CLASS, operation: Enum.Operation.CREATE }),
        AcademicValidation.createClass,
        catchError,
        ClassControler.createClass
    )
    .put(
        "/class/:classId",
        roleAuth({ module: Enum.ModuleName.ACADEMICS, subModule: Enum.SubModuleName.CLASS, operation: Enum.Operation.UPDATE }),
        AcademicValidation.updateClass,
        catchError,
        ClassControler.updateClass
    )
    .post(
        "/class/:classId/upsert-section",
        roleAuth({ module: Enum.ModuleName.ACADEMICS, subModule: Enum.SubModuleName.SECTION, operation: Enum.Operation.CREATE }),
        AcademicValidation.upsertSectionsBulk,
        catchError,
        ClassControler.upsertSectionsBulk
    )
    .post(
        "/class/:classId/upsert-subjects",
        roleAuth({ module: Enum.ModuleName.ACADEMICS, subModule: Enum.SubModuleName.CLASS, operation: Enum.Operation.CREATE }),
        AcademicValidation.upsertSubjectBulk,
        catchError,
        ClassControler.upsertSubjectBulk
    )
    .post("/class/:classId/fee-structure",
        roleAuth({ module: Enum.ModuleName.ACADEMICS, subModule: Enum.SubModuleName.CLASS, operation: Enum.Operation.UPDATE }),
        AcademicValidation.upsertClassFeeStructure,
        catchError,
        ClassControler.upsertClassFeeStructure
    )
    .get(
        "/class/all",
        roleAuth({ module: Enum.ModuleName.ACADEMICS, subModule: Enum.SubModuleName.CLASS, operation: Enum.Operation.READ }),
        AcademicValidation.getAllClass,
        catchError,
        ClassControler.getAllClass
    )
    // class subjects, fee structure, sections
    .get(
        "/class/:classId/subjects",
        roleAuth({ module: Enum.ModuleName.ACADEMICS, subModule: Enum.SubModuleName.CLASS, operation: Enum.Operation.READ }),
        AcademicValidation.getSubjectsByClass,
        catchError,
        ClassControler.getSubjectsByClass
    )
    .get(
        "/class/:classId/fee-structure",
        roleAuth({ module: Enum.ModuleName.ACADEMICS, subModule: Enum.SubModuleName.CLASS, operation: Enum.Operation.READ }),
        AcademicValidation.getClassFeeStructure,
        catchError,
        ClassControler.getClassFeeStructure
    )
    .get(
        "/class/:classId/sections",
        roleAuth({ module: Enum.ModuleName.ACADEMICS, subModule: Enum.SubModuleName.SECTION, operation: Enum.Operation.READ }),
        AcademicValidation.getClassSections,
        catchError,
        ClassControler.getAllSections
    )
    .get(
        "/:classId",
        roleAuth({ module: Enum.ModuleName.ACADEMICS, subModule: Enum.SubModuleName.CLASS, operation: Enum.Operation.READ }),
        AcademicValidation.getClassById,
        catchError,
        ClassControler.getClassById
    )








    // old 
    .patch(
        "/assign-faculty/:sessionId",
        roleAuth({ module: Enum.ModuleName.ACADEMICS, subModule: Enum.SubModuleName.CLASS, operation: Enum.Operation.UPDATE }),
        AcademicValidation.assignFaculty,
        catchError,
        ClassControler.assignFaculty
    )
    .patch(
        "/remove-faculty/:sessionId",
        roleAuth({ module: Enum.ModuleName.ACADEMICS, subModule: Enum.SubModuleName.CLASS, operation: Enum.Operation.UPDATE }),
        AcademicValidation.removeFaculty,
        catchError,
        ClassControler.removeAssignedTeacher
    )
    .post(
        "/timetable",
        roleAuth({ module: Enum.ModuleName.ACADEMICS, subModule: Enum.SubModuleName.TIMETABLE, operation: Enum.Operation.CREATE }),
        AcademicValidation.createTimeTable,
        catchError,
        ClassControler.createTimeTable
    )
    .get(
        "/timetable/:sessionId/:classId/:sectionId",
        roleAuth({ module: Enum.ModuleName.ACADEMICS, subModule: Enum.SubModuleName.TIMETABLE, operation: Enum.Operation.READ }),
        AcademicValidation.getTimeTableofClass,
        catchError,
        ClassControler.getTimeTableofClass
    )


export default router;
