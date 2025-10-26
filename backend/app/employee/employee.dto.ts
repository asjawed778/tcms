import { BaseSchema } from "../common/dto/base.dto";
import { Types } from "mongoose";
import * as Enum from "../common/utils/enum";
import { IDocument } from "../common/dto/common.dto";

export interface WorkExperience {
    organisationName: string;
    years: number;
    designation: string;
};

export interface IEmployee extends BaseSchema {
    employeeId: string;
    user: Types.ObjectId;
    fatherName?: string;
    motherName?: string;

    designation: Enum.FacultyDesignation;
    expertise: string[];
    qualification: string;
    certification?: string;

    phoneNumber: string;
    gender: Enum.Gender;
    dob: Date;
    photo?: string;
    aadhaarNumber?: number;
    address: Types.ObjectId
    dateOfJoining: Date;
    experience?: WorkExperience[];
    documents: IDocument[];

    // Job Details
    status: Enum.EmployeeStatus;
};

export interface ICreateFaculty extends Omit<IEmployee, "createdAt" | "updatedAt" | "_id"> { };
