import { BaseSchema } from "../common/dto/base.dto";
import * as Enum from "../common/utils/enum";
import { Types } from "mongoose";

export interface ISection extends BaseSchema {
    name: string;
    sectionId: string;
    classId: Types.ObjectId;
    sessionId: Types.ObjectId;
    classTeacher?: Types.ObjectId;
    capacity?: number;
    deleted: boolean;
};

export interface ICreateSection extends Omit<ISection, "_id" | "deleted" | "createdAt" | "updatedAt"> { }

export interface TextBook {
    title: string;
    coverPhoto?: string;
    publication?: string;
    author?: string;
    ISBN?: string;
};

export interface ISubject extends BaseSchema {
    name: string;
    subjectId: string;
    classId: Types.ObjectId;
    sessionId: Types.ObjectId;
    subjectType: Enum.SubjectType;
    syllabus?: string;
    books?: TextBook[];
};

export interface ICreateSubject extends Omit<ISubject, "_id" | "createdAt" | "updatedAt"> { }


export interface IClass extends BaseSchema {
    name: string;
    classId: string;
    session: Types.ObjectId;
    courseStream?: Enum.CourseStream;
    status: Enum.ClassStatus;
};

export interface ICreateClass extends Omit<IClass, "sections" | "subjects" | "deleted" | "_id" | "createdAt" | "updatedAt"> {
    subjects?: ICreateSubject[];
    sections?: ICreateSection[];
};

export interface ITimeSlot {
    startTime: string;
    endTime: string;
    duration?: string;
};

export interface IPeriod {
    peridType: Enum.PeriodType;
    periodNumber: number;
    subject?: Types.ObjectId;
    faculty?: Types.ObjectId;
    room?: string;
    timeSlot: ITimeSlot
};

export interface IDaySchedule {
    day: Enum.WeekDay;
    periods?: IPeriod[];
    isHoliday?: boolean;
    holidayReason?: string;
};

export interface ITimeTable extends BaseSchema {
    session: Types.ObjectId;
    class: Types.ObjectId;
    section: Types.ObjectId;
    weeklySchedule: IDaySchedule[];
    status: Enum.TimeTableStatus;
    effectiveFrom: Date;
    effectiveTo: Date;
};

export interface ICreateTimeTable extends Omit<ITimeTable, "_id" | "createdAt" | "updatedAt"> { }

// class fee structure dto
export interface IFeeDetails {
    feeType: string;
    amount: number;
    isOptional?: boolean;
    billingFrequency?: Enum.FeeFrequency;
};

export interface IClassFeeStructure extends BaseSchema {
    classId: Types.ObjectId;
    session: Types.ObjectId;
    effectiveFrom: Date;
    feeDetails: IFeeDetails[];
    remarks?: string;
    status?: Enum.ActiveStatus;
};

export interface ICreateClassFeeStructure extends Omit<IClassFeeStructure, "_id" | "createdAt" | "updatedAt"> { }