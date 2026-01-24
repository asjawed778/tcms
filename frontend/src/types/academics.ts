
// Class....................................................................
interface FeeDetail {
  amount: string;               
  billingFrequency: string;
  isOptional: boolean;
  feeType: string;
}
interface ClassRequest {
  name: string;
  session: string;
  courseStream: string;
  effectiveFrom: string;
  remarks: string;
  status: string;
  sections: SectionRequest[];
  subjects: SubjectRequest[];
  feeDetails: FeeDetail[];
}
interface Classes {
  name: string;
  _id: string;
  classId: string;
  courseStream: string;
  feeStructureAdded: boolean;
  sections: string[];
  subjects: string[];
}
interface ClassResponse {
  classes: Classes[];
}
// Section...................................................................
interface SectionRequest {
  name: string;
  classId: string;
  classTeacher?: string;
  capacity?: number;
  sessionId: string;
}
interface SectionResponse extends SectionRequest, BaseSchema {
  sectionId: string;
  totalAdmissions: number;
  class: {
    id: string;
    name: string;
  };
}
interface SectionResponseList {
  sections: SectionResponse[];
}
// Subject...................................................................
interface Book {
  coverPhoto?: string;
  title?: string;
  publication?: string;
  author?: string;
  ISBN?: string;
}
interface SubjectRequest {
  classId: string;
  name: string;
  subjectType: string;
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
