import { Types } from "mongoose";
import { BaseSchema } from "../common/dto/base.dto";

export interface WorkExperience {
    organisationName: string;
    years: number;
    designation: string;
};

export interface IEmployee extends BaseSchema {
    employeeId: string;
    userId?: string;
    name: string;
    email: string;
    phone: string;
    address: Types.ObjectId
    dateOfJoining: Date;
    experience?: WorkExperience[];
    dateOfLeaving?: Date;
    isActive: boolean;
    salary: number;
}

export interface ICreateEmployee extends Omit<IEmployee, "employeeId" | "createdAt" | "updatedAt" | "_id"> {
    employeeId?: string;
}