import {
  ActionTaken,
  AdmissionStatus,
  BloodGroup,
  Gender,
  Religion,
  RemarkType,
  StudentStatus,
} from "@/utils/enum";
import * as CommonTypes from "@/types";

export interface BasicDetailsRequest {
  firstName: string;
  lastName?: string;
  dob: string;
  gender: Gender;
  photo?: string;
  email?: string;
  contactNumber?: string;
  adharNumber?: string;
  nationality?: string;
  motherTongue?: string;
  religion?: Religion | "";
  bloodGroup?: BloodGroup | "";
}

export interface ParentInfo {
  name?: string;
  qualification?: string;
  occupation?: string;
  contactNumber?: string;
  email?: string;
  businessOrEmployerName?: string;
  officeAddress?: string;
  officeNumber?: string;
}

export interface ParentDetailsRequest {
  father: ParentInfo;
  mother: ParentInfo;
  localGuardian: ParentInfo;
}

export interface PreviousSchool {
  name?: string;
  address?: string;
  reasonForLeaving?: string;
  dateOfLeaving?: string;
  schoolLeavingCertificate: CommonTypes.DocumentRequest;
  transferCertificate: CommonTypes.DocumentRequest;
}

export interface AdmissionDetailsRequest {
  session: string | null;
  class: string | null;
  section: string | null;
  admissionYear?: number | null;
  // admissionStatus?: AdmissionStatus;
  previousSchool?: PreviousSchool;
}

export interface AdmissionDetailsResponse extends CommonTypes.BaseSchema {
  admissionStatus: AdmissionStatus;
  rollNumber: number;
  class: {
    name: string;
    _id: string;
  },
  section: {
    name: string;
    _id: string;
  }
  session: {
    session: string;
    _id: string;
  }
}
export interface StudentDetailsResponse
  extends CommonTypes.BaseSchema,
    BasicDetailsRequest,
    ParentDetailsRequest, AdmissionDetailsRequest {
  enrollmentNumber: string;
  status: StudentStatus;
  address: CommonTypes.AddressResponse;
  documents: CommonTypes.DocumentRequest;
  admission: AdmissionDetailsResponse;
}

export interface StudentResponse {
  student: StudentDetailsResponse;
}
export interface StudentResponseList {
  students: Array<{
    student: StudentDetailsResponse;
    admission: AdmissionDetailsRequest;
  }>;
  currentPage: number;
  hasNext: boolean;
  hasPrevious: boolean;
  pageLimit: number;
  totalDocs: number;
  totalPages: number;
}

export interface AddRemarkRequest {
  sessionId: string;
  studentId: string;
  remarkType: RemarkType;
  description: string;
  actionTaken?: ActionTaken;
  supportingDocuments?: Document[];
}
export interface RemarkResponse
  extends AddRemarkRequest,
    CommonTypes.BaseSchema {}
