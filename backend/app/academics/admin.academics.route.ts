import { Router } from "express";
import { catchError } from "../common/middleware/cath-error.middleware";
import * as ClassControler from "./academic.controller";
import * as AcademicValidation from "./academics.validation";
import * as Enum from "../common/utils/enum";
import { roleAuth } from "../common/middleware/role-auth.middleware";

const router = Router();

router
    // subject routes
    .post(
        "/class",
        roleAuth({ module: Enum.ModuleName.ACADEMICS, subModule: Enum.SubModuleName.SUBJECTS, operation: Enum.Operation.CREATE }),
        AcademicValidation.createSubject,
        catchError,
        ClassControler.createSubject
    )
    .post(
        "/subject/bulk",
        roleAuth({ module: Enum.ModuleName.ACADEMICS, subModule: Enum.SubModuleName.SUBJECTS, operation: Enum.Operation.CREATE }),
        AcademicValidation.createSubjectBulk,
        catchError,
        ClassControler.createSubjectBulk
    )
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
    .get(
        "/subject/all",
        roleAuth({ module: Enum.ModuleName.ACADEMICS, subModule: Enum.SubModuleName.SUBJECTS, operation: Enum.Operation.READ }),
        AcademicValidation.getAllSubjects,
        catchError,
        ClassControler.getAllSubjects
    )

    // section routes
    .post(
        "/section",
        roleAuth({ module: Enum.ModuleName.ACADEMICS, subModule: Enum.SubModuleName.SECTION, operation: Enum.Operation.CREATE }),
        AcademicValidation.createSection,
        catchError,
        ClassControler.createSection
    )
    .post(
        "/section/bulk",
        roleAuth({ module: Enum.ModuleName.ACADEMICS, subModule: Enum.SubModuleName.SECTION, operation: Enum.Operation.CREATE }),
        AcademicValidation.createSectionsBulk,
        catchError,
        ClassControler.createSectionsBulk
    )
    .put(
        "/section/:sectionId",
        roleAuth({ module: Enum.ModuleName.ACADEMICS, subModule: Enum.SubModuleName.SECTION, operation: Enum.Operation.UPDATE }),
        AcademicValidation.editSection,
        catchError,
        ClassControler.editSection
    )
    .delete(
        "/section/:sectionId",
        roleAuth({ module: Enum.ModuleName.ACADEMICS, subModule: Enum.SubModuleName.SECTION, operation: Enum.Operation.DELETE }),
        AcademicValidation.deleteSection,
        catchError,
        ClassControler.deleteSection
    )
    .get(
        "/section/all",
        roleAuth({ module: Enum.ModuleName.ACADEMICS, subModule: Enum.SubModuleName.SECTION, operation: Enum.Operation.READ }),
        AcademicValidation.getAllSections,
        catchError,
        ClassControler.getAllSections
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
        "/class/:classId/upsert-subjects",
        roleAuth({ module: Enum.ModuleName.ACADEMICS, subModule: Enum.SubModuleName.CLASS, operation: Enum.Operation.CREATE }),
        AcademicValidation.upsertSubjectBulk,
        catchError,
        ClassControler.upsertSubjectBulk
    )
    .put("/class/:classId/fee-structure",
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
    // class subjects
    .get(
        "class/:classId/subjects",
        roleAuth({ module: Enum.ModuleName.ACADEMICS, subModule: Enum.SubModuleName.CLASS, operation: Enum.Operation.READ }),
        AcademicValidation.getSubjectsByClass,
        catchError,
        ClassControler.getSubjectsByClass
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
