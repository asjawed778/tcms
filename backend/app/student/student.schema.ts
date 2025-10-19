import mongoose from "mongoose";
import { IStudent } from './student.dto';
import * as Enum from "../common/utils/enum";

// Parent details sub-schema
const ParentDetails = {
    _id: false,
    name: { type: String, required: false },
    qualification: { type: String, required: false },
    occupation: { type: String, required: false },
    businessOrEmployerName: { type: String },
    officeAddress: { type: String },
    officeNumber: { type: String },
    email: { type: String },
    contactNumber: { type: String },
};

// Document sub-schema
const Document = {
    _id: false,
    name: { type: String, required: false },
    documentNumber: { type: String },
    url: { type: String, required: false },
};

// Previous school sub-schema
  const PreviousSchool = {
    _id: false,
    name: { type: String, required: false },       
    address: { type: String, required: false },
    reasonForLeaving: { type: String, required: false },
    dateOfLeaving: { type: Date, required: false }, 
    schoolLeavingCertificate: { type: Document },
    transferCertificate: { type: Document },
};

// student schema
const studentSchema = new mongoose.Schema<IStudent>({
    enrollmentNumber: {
        type: String,
        unique: true,
    },
    name: { type: String, required: false },
    dob: { type: Date, required: false },
    gender: {
        type: String,
        enum: Object.values(Enum.Gender),
        required: false,
    },
    nationality: { type: String, required: false },
    religion: {
        type: String,
        enum: Object.values(Enum.Religion),
        required: false,
    },
    motherTongue: { type: String, required: false },
    profileImage: { type: String, required: false },
    adharNumber: { type: String, required: false, unique: true, sparse: true},
    contactNumber: { type: String },
    email: { type: String },
    bloodGroup: {
        type: String,
        enum: Object.values(Enum.BloodGroup),
    },

    father: { type: ParentDetails, required: false },
    mother: { type: ParentDetails, required: false },
    localGuardian: {type: ParentDetails, required: false},

    previousSchool: PreviousSchool,

    address: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Address",
        required: false,
    },

    documents: [Document],

    admissionYear: { type: Number, required: false },

    status: {
        type: String,
        enum: Object.values(Enum.StudentStatus),
        default: Enum.StudentStatus.DRAFT,
    },
}, { timestamps: true, });


export default mongoose.model<IStudent>("Student", studentSchema);


