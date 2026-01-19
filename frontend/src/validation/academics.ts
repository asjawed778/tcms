import * as yup from "yup";
import * as Enum from "@/utils/enum";


// Subject..........................................................................
export const subjectSchema = yup.object({
  classId: yup.string().required("Class name is required"),
  sessionId: yup.string().required("Session is required"),
  name: yup.string().required("Subject name is required"),
  subjectType: yup
    .mixed<Enum.SubjectType>()
    .oneOf(Object.values(Enum.SubjectType))
    .required("Subject type is required"),
  syllabus: yup.string().optional(),
  books: yup.array()
    .of(
      yup.object({
        coverPhoto: yup.string().optional(),
        title: yup.string().optional(),
        author: yup.string().optional(),
        publication: yup.string().optional(),
        ISBN: yup.string().optional(),
      })
    ),
});
export const bulkSubjectSchema = yup.object({
  subjects: yup
    .array()
    .of(
      yup.object({
        name: yup.string().required("Subject name is required"),
        subjectType: yup.string().required("Subject type is required"),
        syllabus: yup.string().optional(),
      })
    )
    .min(1, "At least one subject is required"),
});

// Tiem table..........................................
export const timeTableBasicDetailsSchema = yup.object({
  classId: yup
    .string()
    .required("Class is required"),
  sectionId: yup
    .string()
    .required("Section is required"),
  sessionId: yup
    .string()
    .required("Session is required"),
  effectiveFrom: yup
    .date()
    .typeError("Effective From date is required")
    .required("Effective From is required"),
  effectiveTo: yup
    .date()
    .typeError("Effective To date is required")
    .required("Effective To is required")
    .min(
      yup.ref("effectiveFrom"),
      "Effective To must be after Effective From",
    ),
});