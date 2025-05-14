import mongoose from "mongoose";
import { IStudent } from './student.dto';
import * as Enum from "../common/constant/enum";

// Parent details sub-schema
const ParentDetails = {
    name: { type: String, required: true },
    qualification: { type: String, required: true },
    occupation: { type: String, required: true },
    businessOrEmployerName: { type: String },
    officeAddress: { type: String },
    officeNumber: { type: String },
    email: { type: String },
    contactNumber: { type: String },
};

// Document sub-schema
const Document = {
    name: { type: String, required: true },
    documentNumber: { type: String },
    url: { type: String, required: true },
};

// Previous school sub-schema
const PreviousSchool = {
    name: { type: String, required: true },
    address: { type: String, required: true },
    reasonForLeaving: { type: String, required: true },
    dateOfLeaving: { type: Date, reqired: true },
    schoolLeavingCertificate: { type: Document },
    transferCertificate: { type: Document },
};

// student schema
const studentSchema = new mongoose.Schema<IStudent>({
    enrollmentNumber: {
        type: String,
        required: true,
        // unique: true,
    },
    name: { type: String, required: true },
    dob: { type: Date, required: true },
    gender: {
        type: String,
        enum: Object.values(Enum.Gender),
        required: true,
    },
    nationality: { type: String, required: true },
    religion: {
        type: String,
        enum: Object.values(Enum.Religion),
        required: true,
    },
    motherTongue: { type: String, required: true },
    image: { type: String, required: true },
    adharNumber: { type: String, required: true, unique: true },
    contactNumber: { type: String },
    email: { type: String },
    bloodGroup: {
        type: String,
        enum: Object.values(Enum.BloodGroup),
    },

    father: { type: ParentDetails, required: true },
    mother: { type: ParentDetails, required: true },
    localGuardian: ParentDetails,

    previousSchool: PreviousSchool,

    address: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Address",
        required: true,
    },

    documents: [Document],

    admissionYear: { type: Number, required: true },

    status: {
        type: String,
        enum: Object.values(Enum.StudentStatus),
        default: Enum.StudentStatus.ACTIVE,
        required: true,
    },
}, { timestamps: true, });

studentSchema.pre("save", async function (next) {
    if (!this.enrollmentNumber) {
        const year = this.admissionYear;
        let unique = false;
        let registrationNumber = "";
        while (!unique) {
            const randomNumber = Math.floor(100000 + Math.random() * 900000);
            registrationNumber = `TCMS${year}${randomNumber}`;
            const existingStudent = await mongoose.models.Student.findOne({
                enrollmentNumber: registrationNumber
            });
            if (!existingStudent) {
                unique = true;
            }
        }
        this.enrollmentNumber = registrationNumber;
    }
    next();
});



export default mongoose.model<IStudent>("Student", studentSchema);
