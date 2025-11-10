import { SubjectCategory, SubjectType } from "@/utils/enum";

export interface PredefinedSubject {
  id: string;
  name: string;
  type: SubjectType;
  category: SubjectCategory;
}

export interface SubjectForm {
  preDefinedId?: string;
  name: string;
  subjectType: string;
  subjectCategory: string;
  publication: string;
  writer: string;
  ISBN: string;
  syllabus: string;
}