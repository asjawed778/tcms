import { BaseSchema } from "../common/dto/base.dto";
import { Types } from "mongoose";
import * as FacultyEnum from "./faculty.constant";


export interface IFaculty extends BaseSchema {
    employeeId: string;
    userId: Types.ObjectId;

    //personal details
    name: string;
    fatherName?: string;
    motherName?: string;
    email: string;
    phoneNumber: string;


    // Professional Details
    designation: FacultyEnum.Designation;
    expertiseSubjects: string[];
    qualification: string;
    certification?: string;

    // Job Details
    status: FacultyEnum.FacultyStatus;
};

export interface ICreateFaculty extends Omit<IFaculty, "createdAt" | "updatedAt" | "_id"> {};
