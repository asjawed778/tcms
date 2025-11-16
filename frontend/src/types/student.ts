import { BloodGroup, Gender, Religion } from "@/utils/enum";
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

export interface ParentRequest {
  father: ParentInfo;
  mother: ParentInfo;
  localGuardian: ParentInfo;
}

export interface PreviousSchool {
  name?: string;
  address?: string;
  reasonForLeaving?: string;
  dateOfLeaving?: string;
  schoolLeavingCertificate: CommonTypes.Document;
  transferCertificate: CommonTypes.Document;
}

export interface AdmissionDetailsRequest {
  session: string | null;
  class: string | null;
  section: string | null;
  admissionYear?: number | null;
  previousSchool: PreviousSchool;
}
