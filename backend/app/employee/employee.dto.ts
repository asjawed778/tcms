import { Types } from "mongoose";
import { BaseSchema } from "../common/dto/base.dto";
import { IDocument } from "../common/dto/common.dto";
import { Gender } from "../common/constant/enum";

export interface WorkExperience {
    organisationName: string;
    years: number;
    designation: string;
};

export interface IEmployee extends BaseSchema {
    employeeId: string;
    user?: string;
    // name: string;
    // email: string;
    phoneNumber: string;
    gender: Gender;
    dob: Date;
    photo?: string;
    aadhaarNumber: number;
    address: Types.ObjectId
    dateOfJoining: Date;
    experience?: WorkExperience[];
    dateOfLeaving?: Date;
    isActive: boolean;
    salary: number;
    documents: IDocument[];
}

export interface ICreateEmployee extends Omit<IEmployee, "employeeId" | "createdAt" | "updatedAt" | "_id"> {}