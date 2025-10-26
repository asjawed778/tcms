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
}
export interface ICreateSection extends Omit<ISection, "_id" | "deleted" | "createdAt" | "updatedAt"> { }


export interface ISubject extends BaseSchema {
    name: string;
    subjectId: string;
    sessionId: Types.ObjectId;
    publication?: string;
    writer?: string;
    ISBN?: string;
    subjectType: Enum.SubjectType;
    subjectCategory: Enum.SubjectCategory;
    syllabus?: string;
}

export interface ICreateSubject extends Omit<ISubject, "_id" | "deleted" | "createdAt" | "updatedAt"> { }

export interface IClass extends BaseSchema {
    name: string;
    classId: string;
    session: Types.ObjectId;
    subjects: Types.ObjectId[];
    courseStream?: Enum.CourseStream;
    deleted: boolean;
}
export interface ICreateClass extends Omit<IClass, "sections" | "subjects" | "deleted" | "_id" | "createdAt" | "updatedAt"> {
    subjects?: ICreateSubject[];
    sections?: ICreateSection[];
}

export interface ITimeSlot {
    start: { hour: number; minute: number };
    end: { hour: number; minute: number };
    durationMinutes?: number;
}

export interface IPeriod {
    peridType: Enum.PeriodType;
    periodNumber: number;
    subject?: Types.ObjectId;
    faculty?: Types.ObjectId;
    room?: string;
    timeSlot: ITimeSlot
}

export interface IDaySchedule {
    day: Enum.WeekDay;
    periods?: IPeriod[];
    isHoliday?: boolean;
    holidayReason?: string;
}

export interface ITimeTable extends BaseSchema {
    session: Types.ObjectId;
    class: Types.ObjectId;
    section: Types.ObjectId;
    weeklySchedule: IDaySchedule[];
}

export interface ICreateTimeTable extends Omit<ITimeTable, "_id" | "createdAt" | "updatedAt"> { }

// class fee structure dto
export interface IFeeDetails {
    feeType: Enum.FeeType;
    otherFeeType?: string;
    amount: number;
    isOptional?: boolean;
    applicableType?: Enum.FeeApplicableType;
    applicableFrequency?: Enum.FeeFrequency;
}

export interface IFrequencyWiseStructure {
    frequency: Enum.FeeFrequency;
    feeDetails: IFeeDetails[];
    totalAmount: number;
}

export interface IClassFeeStructure extends BaseSchema {
    classId: Types.ObjectId;
    session: Types.ObjectId;
    effectiveFrom: Date;
    structures: IFrequencyWiseStructure[];
    remarks?: string;
    status?: Enum.ActiveStatus;
}

export interface ICreateClassFeeStructure extends Omit<IClassFeeStructure, "_id" | "createdAt" | "updatedAt"> { }