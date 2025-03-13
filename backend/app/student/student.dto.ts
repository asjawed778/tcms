import { BaseSchema } from "../common/dto/base.dto";
import { Types } from 'mongoose';
import { ActionTaken, ActivityType, ParticipationLevel, RemarkType } from "./student.constant";
import { Gender, Religion } from "../common/constant/constant";

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
}


export interface ExtracurricularActivity extends BaseSchema {
    studentId: Types.ObjectId;
    activityName: string;
    type: ActivityType;
    participationLevel: ParticipationLevel;
    achievement?: string;
    organizedBy?: Types.ObjectId;
    date: Date;
    duration?: string;
    certificateUrl?: string;
}

export interface ParentDetails {
    name: string;
    qualification: string;
    occupation: string;
    businessOrEmployerName?: string;
    officeAddress?: string;
    officeNumber?: string;
};

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
    adharNumber: number;

    // parents details
    father: ParentDetails;
    mother: ParentDetails;
    localGuardian: ParentDetails;

    // address details
    address: Types.ObjectId;


}