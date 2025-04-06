import { BaseSchema } from "../common/dto/base.dto";
import { Types } from "mongoose";
import * as FacultyEnum from "./faculty.constant";
import { Gender } from "../common/constant/constant";
import { Document } from "../common/dto/common.dto";


export interface WorkExperience {
    organisationName: string;
    years: number;
    designation: string;
};


export interface IFaculty extends BaseSchema {
    employeeId: string;
    userId: Types.ObjectId;

    //personal details
    name: string;
    fatherName?: string;
    motherName?: string;
    email: string;
    phoneNumber: string;
    gender: Gender;
    dob: Date;
    address: Types.ObjectId; 
    photoUrl?: string;
    aadhaarNumber: number;

    // Professional Details
    designation: FacultyEnum.Designation;
    joiningDate: Date;
    experience?: WorkExperience[];
    expertiseSubjects: string[];
    qualification: string;
    certification?: string;

    // Job Details
    status: FacultyEnum.FacultyStatus;

    // Documents
    documents: Document[];
};
