import * as Enum from "@/utils/enum";
import { EasingModifier } from "framer-motion";

//  General data..................................................
interface Options{
  label: string;
  value: string;
};

interface ForgotPasswordFormValues {
  email: string;
}
interface ResetPasswordFormValues {
  newPassword: string;
  confirmPassword: string;
}

interface Session {
  _id: string;
  session: string;
  startDate: string;
  endDate: string;
  sessionStatus: Enum.SessionStatus;
}

interface SessionApiResponse {
  data: Session[];
  message: string;
  success: boolean;
}

interface SessionFormValues {
  session?: string;
  startDate: string;
  endDate: string;
  sessionStatus: Enum.SessionStatus;
}

interface LoginFormValues {
  email: string;
  password: string;
}

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  profilePic: string;
}
interface AuthResponse {
  data: {
    accessToken: string;
    refreshToken: string;
    user: User;
  };
  message: string;
  success: boolean;
}

interface ApiResponse {
  data: Object;
  message: string;
  success: boolean;
}
// Faculty....................
interface Address {
  city: string;
  state: string;
  country: string;
  pinCode: number;
  addressLine1: string;
  addressLine2?: string;
}

interface Experience {
  organisationName: string;
  years: number;
  designation: string;
}

interface Document {
  name: string;
  documentNumber: string;
  url: string;
}

interface FacultyFormData {
  _id?: string;
  name: string;
  fatherName: string;
  motherName: string;
  email: string;
  phoneNumber: string;
  gender: Enum.Gender;
  dob: string;
  photo: string;
  aadhaarNumber: string;
  address: Address;
  designation: Enum.Designation;
  dateOfJoining: string;
  expertiseSubjects: string[];
  qualification: string;
  salary: number;
  experience: Experience[];
  documents: Document[];
}

interface FacultyTableData {
  currentPage: number;
  limit: number;
  totalDocuments: number;
  showing: number;
  faculty: FacultyFormData[];
}

interface FacultyApiResponse {
  data: FacultyTableData;
  success: boolean;
  message: string;
}

// Class..............
interface ClassTableData {
  classes: ClassFormData[];
}
interface ClassApiResponse {
  data: ClassTableData;
  success: boolean;
  message: string;
}
interface Subjects {
  _id: string;
  name: string;
  subjectType: Enum.SubjectType;
  subjectCategory: Enum.SubjectCategory;
  publication: string;
  writer: string;
  ISBN: string;
}
interface Sections {
  _id?: string;
  name: string;
  capacity: number;
}
interface FeeDeclaration {
  amount: number;
  total: number;
}
interface FeeStructure {
  monthly: FeeDeclaration;
  quarterly: FeeDeclaration;
  halfYearly: FeeDeclaration;
  yearly: FeeDeclaration;
}
interface ClassFormData {
  _id?: string;
  name: Enum.ClassName;
  courseStream: Enum.CourseStream;
  subjects: Subjects[];
  sections: Sections[];
  feeStructure: FeeStructure;
}
interface Time {
  hour: number;
  minute: number;
}
interface TimeSlot {
  start: Time;
  end: Time;
}
interface Periods {
  periodNumber: number;
  periodType: Enum.PeriodType;
  subject: string;
  faculty: string;
  timeSlot: TimeSlot;
  room?: string;
};
interface WeeklyScheduleItem{
  day: Enum.WeekDay;
  isHoliday?: boolean;
  holidayReason?: string;
  periods?: Periods[];
};
interface TimeTableFormData {
  classId: string;
  sectionId: string;
  weeklySchedule: WeeklyScheduleItem[];
}
interface UnAssignFacultyFormData {
  sessionId: string;
  day: string;
  startTime: Time;
  endTime: Time;
}
interface UnAssingFaculty {
  _id: string;
  name: string;
  designation: string;
}
interface UnAssingFacultyApiResponse {
  data: UnAssingFaculty[];
  message: string;
  success: boolean;
}

// Student Admission Data..................................
interface Parent {
  name: string;
  email?: string;
  contactNumber?: number;
  qualification: string;
  occupation: string;
  bussinessOrEmployerName?: string;
  officeAddress?: string;
  officeNumber?: number;
}
interface PreviousSchool {
  name: string;
  address: string;
  reasonForLeaving: string;
  dateOfLeaving: string;
  schoolLeavingCertificate: Document;
  transferCertificate: Document;
}
interface AdmissionClass {
  name: Enum.ClassName;
  section: string;
  admissionDate: string;
}
interface StudentFormData {
  _id?: string;
  enrollmentNumber?: string;
  name: string;
  dob: string;
  gender: string;
  nationality: string;
  religion: string;
  motherTongue: string;
  image: string;
  adharNumber: string;
  contactNumber?: number;
  email?: string;
  bloodGroup?: Enum.BloodGroup;
  address: Address;
  father: Parent;
  mother: Parent;
  localGuardian?: Parent;
  previousSchool?: PreviousSchool;
  admission: AdmissionClass;
  documents: Document[];
}
interface Admission {
  admissionStatus: string;
  rollNumber: number;
  _id: string;
  deleted: boolean;
  createdAt: string;
  updatedAt: string;
  class: ClassFormData;
  section: Sections;
  session: Session;
}
interface Students {
  student: StudentFormData;
  admission: Admission;
}
interface studentTableData {
  students: Students[];
  currentPage: number;
  totalPages: number;
  totalDocs: number;
  pageLimit: number;
  hasPrevious: boolean;
  hasNext: boolean;
}
interface StudentApiResponse {
  data: studentTableData;
  success: boolean;
  message: string;
}

// Add Reamarks Data.........................................
interface AddRemarkFormData {
  sessionId: string;
  studentId: string;
  remarkType: Enum.RemarkType;
  description: string;
  actionTaken?: Enum.ActionTaken;
  supportingDocuments?: Document[];
}
