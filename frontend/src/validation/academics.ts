import * as yup from "yup";
import * as Enum from "@/utils/enum";


// Subject..........................................................................
export const subjectSchema = yup.object({
  sessionId: yup.string().required("Session is required"),
  name: yup.string().required("Subject name is required"),
  subjectType: yup
    .mixed<Enum.SubjectType>()
    .oneOf(Object.values(Enum.SubjectType))
    .required("Subject type is required"),
  subjectCategory: yup
    .mixed<Enum.SubjectCategory>()
    .oneOf(Object.values(Enum.SubjectCategory))
    .required("Subject category is required"),
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
        subjectCategory: yup.string().required("Subject category is required"),
        publication: yup.string().optional(),
        writer: yup.string().optional(),
        ISBN: yup.string().optional(),
        syllabus: yup.string().optional(),
      })
    )
    .min(1, "At least one subject is required"),
});