import { BaseSchema } from "../common/dto/base.dto";
import { Types } from 'mongoose';
import * as Enum from "../common/utils/enum";
import { Gender, Religion } from "../common/utils/enum";
import { IDocument } from '../common/dto/common.dto';

export interface IRemark extends BaseSchema {
    student: Types.ObjectId;
    givenBy: Types.ObjectId;
    class: Types.ObjectId;
    section: Types.ObjectId;
    date: Date;
    remarkType: Enum.RemarkType;
    description: string;
    actionTaken?: Enum.ActionTaken;
    supportingDocuments?: {
        name: string;
        url: string;
    }[];
    deleted: boolean;
};
export interface IRemarkCreate extends Omit<IRemark, "_id" | "createdAt" | "updatedAt" | "deleted"> { };
export interface IRemarkUpdate extends Partial<Omit<IRemark, "_id" | "createdAt" | "updatedAt" | "deleted">> { };

export interface ExtracurricularActivity extends BaseSchema {
    student: Types.ObjectId;
    activityName: string;
    type: Enum.ActivityType;
    participationLevel: Enum.ParticipationLevel;
    achievement?: string;
    organizedBy?: string;
    date: Date;
    duration?: string;
    participationType: Enum.ParticipationType;
    certificate?: IDocument;
    positionHeld?: string;
};

export interface ParentDetails {
    name: string;
    qualification?: string;
    occupation?: string;
    businessOrEmployerName?: string;
    officeAddress?: string;
    officeNumber?: string;
    email?: string;
    contactNumber?: string;
};

export interface PreviousSchool {
    name: string;
    address: string;
    reasonForLeaving?: string;
    dateOfLeaving?: Date;
    schoolLeavingCertificate?: IDocument;
    transferCertificate?: IDocument;
};


// todo : we need to add some proper doc - signature(student , parent), image, adhar card -> do not use doucemnt make proper 
export interface IStudent extends BaseSchema {
    enrollmentNumber: string;

    // personal details
    name: string;
    dob: Date;
    gender: Gender;
    nationality?: string;
    religion?: Religion;
    motherTongue?: string;
    profileImage: string;
    adharNumber?: string;
    contactNumber?: string;
    email?: string;
    bloodGroup?: Enum.BloodGroup;

    // parent details
    father?: ParentDetails;
    mother?: ParentDetails;
    localGuardian?: ParentDetails;

    previousSchool?: PreviousSchool;

    // address details
    address: Types.ObjectId;

    // documents 
    documents: IDocument[];

    // acedemic tracking
    admissionYear: number;
    status: Enum.StudentStatus;
};

export interface IAddStudentStep1 {
    name: string;
    dob: Date;
    gender: Enum.Gender;
    nationality?: string;
    religion?: Enum.Religion;
    motherTongue?: string;
    profileImage: string;
    adharNumber?: string;
    contactNumber?: string;
    email?: string;
    bloodGroup?: Enum.BloodGroup;
}




export interface IStudentCreate extends Omit<IStudent, "_id" | "createdAt" | "updatedAt"> { };
export interface IGetStudentResponse<T> {
    students: T[];
    totalDocs: number;
    totalPages: number;
    currentPage: number;
    hasNext: boolean;
    hasPrevious: boolean;
    pageLimit: number;
}

export interface IAdmission extends BaseSchema {
    student: Types.ObjectId;
    session: Types.ObjectId;
    class: Types.ObjectId;
    section: Types.ObjectId;
    rollNumber: number;
    admissionStatus: Enum.AdmissionStatus;
    deleted: boolean;
};

export interface IAdmissionCreate extends Omit<IAdmission, "_id" | "createdAt" | "updatedAt" | "admissionStatus" | "deleted" | "rollNumber" | "student"> { };

export interface AcademicRecord {
    session: string;
    classId: Types.ObjectId;
    section?: string;
    rollNumber: number;
    subjects: Types.ObjectId[];
    totalMarksObtained?: number;
    totalPercentage?: number;
    grade?: string;
    // promotionStatus: Enum.PromotionStatus;
};

export interface IAcademicDetails extends BaseSchema {
    studentId: Types.ObjectId;
    registrationNumber: string;
    records: AcademicRecord[];
};
