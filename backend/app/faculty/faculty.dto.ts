import { BaseSchema } from "../common/dto/base.dto";
import { Types } from "mongoose";
import { Designation, Status } from "./faculty.constant";
import { Gender } from "../common/constant/constant";

export interface JobLeft {
    reason: string;
    date: Date;
    resignationLetterUrl?: string;
};

export interface WorkExperience {
    organisationName: string;
    years: number;
    designation: string;
};

export interface Doucment {
    name: string;
    url: string;
};

export interface Faculty extends BaseSchema {
    employeeId: string;

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
    designation: Designation;
    joiningDate: Date;
    experience?: WorkExperience[];
    expertiseSubjects: string[];
    qualification: string;
    previousSchool?: string;
    certification?: string;

    // Job Details
    jobLeft?: JobLeft;
    status: Status;

    // Documents
    documents: Doucment[];
};
