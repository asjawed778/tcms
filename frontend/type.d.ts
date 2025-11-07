import * as Enum from "@/utils/enum";
import { EasingModifier } from "framer-motion";

// General Types........................................
interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}
interface PaginationQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  [key: string]: any;
}
interface BaseSchema {
  _id: string;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}
interface ApiErrorResponse {
  data: {
    success: boolean;
    error_code: number;
    message: string;
  };
}

// User...................................................................
export interface Operation {
  create: boolean;
  read: boolean;
  update: boolean;
  delete: boolean;
}

export interface SubModule {
  name: string;
  operations: Operation;
}

export interface Permission {
  name: string;
  operations: Operation;
  subModules: SubModule[];
}
export interface Role extends BaseSchema {
  name: Enum.UserRole | string;
  description?: string;
  permissions: Permission[];
}
export interface User extends BaseSchema {
  name: string;
  email: string;
  profilePic?: string;
  role: Role;
  isVerified?: boolean;
  active?: boolean;
  blocked?: boolean;
  blockReason?: string;
  provider?: ProviderType;
}
export interface LoginRequest {
  email: string;
  password: string;
}
interface LoginResponse {
  user: User;
  refreshToken: string;
  accessToken: string;
}
interface SignupRequest {
  name: string;
  email: string;
  password: string;
}
interface SignupResponse extends User {}

//  General data..................................................
interface DropdownOptions {
  label: string;
  value: string;
}

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

// interface ApiResponse {
//   data: Object;
//   message: string;
//   success: boolean;
// }
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
  _id?: string;
  deleted?: boolean;
  name: string;
  subjectType: Enum.SubjectType;
  subjectCategory: Enum.SubjectCategory;
  publication: string;
  writer: string;
  ISBN: string;
}
interface Students {}
interface ClassTeacher {
  name: string;
  designation: string;
  status: Enum.EmployeeStatus;
  employeedId: string;
  _id: string;
}
interface Sections {
  _id?: string;
  name: string;
  capacity: number;
  students?: Students[];
  classTeacher?: ClassTeacher;
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
}
interface WeeklyScheduleItem {
  day: Enum.WeekDay;
  isHoliday?: boolean;
  holidayReason?: string;
  periods?: Periods[];
}
interface TimeTableFormData {
  classId: string;
  sectionId: string;
  sessionId: string;
  weeklySchedule: WeeklyScheduleItem[];
}

// TimeTable response.....................................
interface TimeSlotResponse {
  durationMinutes: number;
  end: Time;
  start: Time;
}
interface FacultyRespose {
  _id: string;
  name: string;
}
interface PeriodsResponse {
  periodNumber: number;
  periodType: Enum.PeriodType;
  room: string;
  faculty: FacultyRespose;
  subject: Subjects;
  timeSlot: TimeSlotResponse;
}
interface weeklyScheduleResponse {
  day: string;
  isHoliday: boolean;
  periods: PeriodsResponse[];
}
interface SectionResponse {
  _id: string;
  name: string;
}
interface ClassResponse {
  _id: string;
  name: Enum.ClassName;
}
interface SessionResponse {
  _id: string;
  session: string;
}
interface TimeTableResponse {
  class: ClassResponse;
  section: SectionResponse;
  session: SessionResponse;
  weeklySchedule: weeklyScheduleResponse[];
}
interface TimeTableApiResponse {
  data: TimeTableResponse[];
  message: string;
  success: boolean;
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
  data: UnAssingFaculty | UnAssingFaculty[];
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
interface AddRemarkRequest {
  sessionId: string;
  studentId: string;
  remarkType: Enum.RemarkType;
  description: string;
  actionTaken?: Enum.ActionTaken;
  supportingDocuments?: Document[];
}
export interface RemarkResponse extends AddRemarkRequest, BaseSchema {}
// Subject...................................................................
export interface SubjectRequest {
  name: string;
  sessionId: string;
  publication?: string;
  writer?: string;
  ISBN?: string;
  subjectType: Enum.SubjectType;
  subjectCategory: Enum.SubjectCategory;
  syllabus?: string;
}
export interface SubjectResponse extends SubjectRequest, BaseSchema {
  subjectId: string;
}
export interface SubjectResponseList {
  subjects: SubjectResponse[];
  currentPage: number;
  totalPages: number;
  totalDoc: number;
}
export interface SectionRequest {
  name: string;
  classId: string;
  classTeacher?: string;
  capacity?: number;
  sessionId: string;
}
export interface SectionResponse extends SectionRequest, BaseSchema {
  sectionId: string;
  totalAdmissions: number;
  class: {
    id: string;
    name: string;
  };
}
export interface SectionResponseList {
  sections: SectionResponse[];
}

// Employee.................................................................
export interface EmployeeBasicDetailsRequest {
  firstName: string;
  lastName?: string;
  fatherName?: string;
  motherName?: string;
  phoneNumber: string;
  email: string;
  aadhaarNumber?: string;
  role?: string;
  dob: string; 
  gender: Enum.Gender;
  photo?: string | File | null;
}
interface EmployeeAddress {
  addressLine1: string;
  addressLine2?: string;
  city?: string;
  state: string;
  country: string;
  pinCode: number;
}
export interface Experience {
  organisationName: string;
  years: number;
  designation: string;
}
export interface ExpertiseSubject {
  subject: string;
}
export interface ProfessionalDetailsRequest {
  designation: string;
  dateOfJoining: string; 
  qualification?: string;
  certificate?: string;
  experience: Experience[];
  expertiseSubjects: ExpertiseSubject[];
}
export interface SalaryStructureRequest {
  basicPay: number;
  effectiveFrom: string; 
  effectiveTo?: string;
  hra?: number;
  allowances?: number;
  deductions?: number;
  remarks?: string;
}
export interface EmployeeDocuments {
  documents: Document[];
}
export interface AddEmployeeRequest extends EmployeeBasicDetailsRequest, ProfessionalDetailsRequest, SalaryStructureRequest, EmployeeDocuments {
  address: EmployeeAddress;
};
export interface EmployeeResponse extends BaseSchema, AddEmployeeRequest {};
export interface EmployeeResponseList {
  employees: EmployeeResponse[];
  showing: number;
  totalDocs: number;
}