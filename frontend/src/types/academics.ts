
// Subject...................................................................
interface Book {
    coverPhoto: string;
    title: string;
    publication: string;
    author: string;
    ISBN: string;
}
interface SubjectRequest {
  name: string;
  sessionId: string;
  subjectType: string;
  subjectCategory: string;
  syllabus?: string;
  books: Book[];
}
interface SubjectResponse extends SubjectRequest, BaseSchema {
  subjectId: string;
}
interface SubjectResponseList {
  subjects: SubjectResponse[];
  currentPage: number;
  totalPages: number;
  totalDoc: number;
}