import { BaseSchema } from "../common/dto/base.dto";
import { CourseStream, SubjectCategory, SubjectType } from "./class.constants";
import { Types } from "mongoose";

export interface FeeStructure {
    monthly: { amount: number; total: number };
    quarterly: { amount: number; total: number };
    halfYearly: { amount: number; total: number };
    yearly: { amount: number; total: number };
}

export interface IClass extends BaseSchema {
    name: string;
    session: string;
    totalSection: number;
    sections: string[];
    subjects: Types.ObjectId[];
    courseStream?: CourseStream;
    classTeacher?: Types.ObjectId;
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
}
