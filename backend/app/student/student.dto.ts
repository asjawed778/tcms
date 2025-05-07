import { BaseSchema } from "../common/dto/base.dto";
import { Types } from 'mongoose';
import { ActionTaken, ActivityType, ParticipationLevel, ParticipationType, RemarkType, StudentStatus } from "./student.constant";
import { Gender, Religion } from "../common/constant/enum";
import { Document } from '../common/dto/common.dto';

export interface Remark extends BaseSchema {
    studentId: Types.ObjectId; 
    givenBy: Types.ObjectId;
    date: Date;
    remarkType: RemarkType;
    description: string; 
    actionTaken?: ActionTaken;
    supportingDocuments?: {
        name: string; 
        url: string;
    }[];
};

export interface ExtracurricularActivity extends BaseSchema {
    studentId: Types.ObjectId;
    activityName: string;
    type: ActivityType;
    participationLevel: ParticipationLevel;
    achievement?: string;
    organizedBy?: string;
    date: Date;
    duration?: string;
    participationType: ParticipationType;
    certificate?: Document;
    positionHeld?: string;
};

export interface ParentDetails {
    name: string;
    qualification: string;
    occupation: string;
    businessOrEmployerName?: string;
    officeAddress?: string;
    officeNumber?: string;
    email?: string;
    contactNumber?: string;
};


// todo : we need to add some proper doc - signature(student , parent), image, adhar card -> do not use doucemnt make proper 
export interface IStudent extends BaseSchema {
    enrollmentNumber: string;

    // personal details
    name: string;
    dob: Date;
    gender: Gender;
    nationality: string;
    religion: Religion;
    motherTongue: string;
    image: string;
    adharNumber: string;
    contactNumber?: string;
    email?: string;
    bloodGroup?: string;

    // parents details
    father: ParentDetails;
    mother: ParentDetails;
    localGuardian?: ParentDetails;

    // address details
    address: Types.ObjectId;

    // documents 
    documents: Document[];

    // acedemic tracking
    admissionYear: number;
    status: StudentStatus; 
};


export interface AcademicRecord {
    session: string;
    classId: Types.ObjectId;
    section?: string;
    rollNumber: number;
    subjects: Types.ObjectId[];
    totalMarksObtained?: number;
    totalPercentage?: number;
    grade?: string;
    // promotionStatus: PromotionStatus;
};

export interface IAcademicDetails extends BaseSchema {
    studentId: Types.ObjectId;
    registrationNumber: string;
    records: AcademicRecord[];
};
