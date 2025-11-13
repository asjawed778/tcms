import * as Enum from "@/utils/enum";
import * as CommonTypes from "@/types";

export interface Experience {
  organisationName: string;
  years: number;
  designation: string;
}

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
  photo?: string;
}

export interface ProfessionalDetailsRequest {
  designation: string;
  dateOfJoining: string;
  qualification?: string;
  certification?: string;
  experience: Experience[];
  expertise: string[];
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

export interface EmployeeDetailsResponse
  extends CommonTypes.BaseSchema,
    EmployeeBasicDetailsRequest,
    ProfessionalDetailsRequest {
  employeeId: string;
  userId: string;
  roleId: string;
  roleName: string;
  status: Enum.EmployeeStatus;
  documents: CommonTypes.Document[];
  address: CommonTypes.AddressResponse;
}

export interface EmployeeDetailsResponseList {
  employees: EmployeeDetailsResponse[];
  showing: number;
  totalDocs: number;
}
export interface Time {
  hour: number;
  minute: number;
}
export interface UnAssignFacultyFormData {
  sessionId: string;
  day: string;
  startTime: Time;
  endTime: Time;
}
export interface UnAssingFaculty {
  _id: string;
  name: string;
  designation: string;
}
export interface UnAssingFacultyApiResponse {
  data: UnAssingFaculty | UnAssingFaculty[];
  message: string;
  success: boolean;
}
