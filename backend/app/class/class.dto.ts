import { BaseSchema } from "../common/dto/base.dto";
import * as Enum from "../common/constant/enum";
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
    courseStream?: Enum.CourseStream;
    feeStructure: FeeStructure;
    deleted: boolean;
}


export interface ISubject extends BaseSchema {
    name: string;
    publication?: string;
    writer?: string;
    ISBN?: string;
    subjectType: Enum.SubjectType;
    subjectCategory: Enum.SubjectCategory;
    deleted: boolean;
}

export interface ICreateSubject extends Omit<ISubject, "_id" | "deleted" | "createdAt" | "updatedAt"> { }

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

export interface ICreateTimeTable extends Omit<ITimeTable, "_id" | "createdAt" | "updatedAt"> {}
