
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

// Time Table..............................................................
interface TimeSlot {
  startTime: string;  
  endTime: string;  
  duration: string;
}
  interface Period {
  periodType?: string;
  periodNumber?: number;
  subject?: string
  faculty?: string;
  room?: string;
  timeSlot?: TimeSlot;
}
interface WeeklyScheduleDay {
  day: string;
  isHoliday?: boolean;
  holidayReason?: string;
  periods?: Period[];
}
interface CreateTimeTableRequest {
  sessionId: string;
  classId: string;
  sectionId: string;
  weeklySchedule: WeeklyScheduleDay[];
  effectiveFrom?: string;
  effectiveTo?: string;
}
