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
  firstName: string;
  lastName?: string;
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
  firstName: string;
  lastName?: string;
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