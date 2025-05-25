import { BaseSchema } from "../common/dto/base.dto";
import { Types } from "mongoose";
import * as Enum from "../common/constant/enum";


export interface IFaculty extends BaseSchema {
    // employeeId: string;
    user: Types.ObjectId;

    //personal details
    // name: string;
    fatherName?: string;
    motherName?: string;
    // email: string;
    // phoneNumber: string;


    // Professional Details
    designation: Enum.FacultyDesignation;
    expertiseSubjects: string[];
    qualification: string;
    certification?: string;

    // Job Details
    status: Enum.FacultyStatus;
};

export interface ICreateFaculty extends Omit<IFaculty, "createdAt" | "updatedAt" | "_id"> {};
