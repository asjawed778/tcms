import { BaseSchema } from "../common/dto/base.dto";
import { CourseStream, SubjectCategory, SubjectType } from "./class.constants";
import { Types } from "mongoose";

export interface IClass extends BaseSchema {
    name: string;
    session: string;
    totalSection: number;
    sections: string[];
    subjects: Types.ObjectId[];
    courseStream?: CourseStream;
    classTeacher?: Types.ObjectId;
}

export interface ISubject extends BaseSchema {
    name: string;
    publication?: string;
    writer?: string;
    ISBN?: string;
    subjectType?: SubjectType;
    subjectCategory: SubjectCategory;
}
