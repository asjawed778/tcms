import * as Enum from "@/utils/enum";
import * as CommonTypes from "@/types";

export interface Experience {
    organisationName: string;
    years: number;
    designation: string;
};

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
};

export interface ProfessionalDetailsRequest {
    designation: string;
    dateOfJoining: string;
    qualification?: string;
    certificate?: string;
    experience: Experience[];
    expertiseSubjects: string[];
};

export interface SalaryStructureRequest {
    basicPay: number;
    effectiveFrom: string;
    effectiveTo?: string;
    hra?: number;
    allowances?: number;
    deductions?: number;
    remarks?: string;
};

export interface EmployeeDetailsResponse extends CommonTypes.BaseSchema, EmployeeBasicDetailsRequest {
    employeeId: string;
    userId: string;
    roleId: string;
    roleName: string;
    status: Enum.EmployeeStatus;
    designation: string;
    dateOfJoining: string;
    qualification?: string;
    expertise: string[];
    documents: CommonTypes.Document[];
    experience: Experience[];
    address: CommonTypes.AddressResponse;
}
