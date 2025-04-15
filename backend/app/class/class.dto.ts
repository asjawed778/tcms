import { BaseSchema } from "../common/dto/base.dto";
import { CourseStream, SubjectCategory, SubjectType } from "./class.constants";
import { Types } from "mongoose";

export interface FeeStructure {
    monthly: { amount: number; total: number };
    quarterly: { amount: number; total: number };
    halfYearly: { amount: number; total: number };
    yearly: { amount: number; total: number };
}

export interface ISection extends BaseSchema {
    name: string;
    classTeacher?: Types.ObjectId;
    capacity?: number;
    students?: Types.ObjectId[];
    deleted: boolean;
}
export interface ICreateSection extends Omit<ISection, "_id" | "deleted" | "createdAt" | "updatedAt"> { }

export interface IClass extends BaseSchema {
    name: string;
    session: Types.ObjectId;
    sections: Types.ObjectId[];
    subjects: Types.ObjectId[];
    courseStream?: CourseStream;
    feeStructure: FeeStructure;
    deleted: boolean;
}


export interface ISubject extends BaseSchema {
    name: string;
    publication?: string;
    writer?: string;
    ISBN?: string;
    subjectType: SubjectType;
    subjectCategory: SubjectCategory;
    deleted: boolean;
}

export interface ICreateSubject extends Omit<ISubject, "_id" | "deleted" | "createdAt" | "updatedAt"> { }

export interface ICreateClass extends Omit<IClass, "sections" | "subjects" | "deleted" | "_id" | "createdAt" | "updatedAt"> {
    subjects?: ICreateSubject[];
    sections?: ICreateSection[];
}
