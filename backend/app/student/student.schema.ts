// import mongoose from "mongoose";
// import { IStudent } from './student.dto';
// import * as Enum from "../common/constant/enum";

// // Parent details sub-schema
// const ParentDetails = {
//     _id: false,
//     name: { type: String, required: true },
//     qualification: { type: String, required: true },
//     occupation: { type: String, required: true },
//     businessOrEmployerName: { type: String },
//     officeAddress: { type: String },
//     officeNumber: { type: String },
//     email: { type: String },
//     contactNumber: { type: String },
// };

// // Document sub-schema
// const Document = {
//     _id: false,
//     name: { type: String, required: true },
//     documentNumber: { type: String },
//     url: { type: String, required: true },
// };

// // Previous school sub-schema
//   const PreviousSchool = {
//     _id: false,
//     name: { type: String, required: false },       
//     address: { type: String, required: false },
//     reasonForLeaving: { type: String, required: false },
//     dateOfLeaving: { type: Date, required: false }, 
//     schoolLeavingCertificate: { type: Document },
//     transferCertificate: { type: Document },
// };

// // student schema
// const studentSchema = new mongoose.Schema<IStudent>({
//     enrollmentNumber: {
//         type: String,
//         unique: true,
//     },
//     name: { type: String, required: true },
//     dob: { type: Date, required: true },
//     gender: {
//         type: String,
//         enum: Object.values(Enum.Gender),
//         required: true,
//     },
//     nationality: { type: String, required: true },
//     religion: {
//         type: String,
//         enum: Object.values(Enum.Religion),
//         required: true,
//     },
//     motherTongue: { type: String, required: true },
//     image: { type: String, required: true },
//     adharNumber: { type: String, required: true, unique: true },
//     contactNumber: { type: String },
//     email: { type: String },
//     bloodGroup: {
//         type: String,
//         enum: Object.values(Enum.BloodGroup),
//     },

//     father: { type: ParentDetails, required: true },
//     mother: { type: ParentDetails, required: true },
//     // localGuardian: ParentDetails,
//     localGuardian: {type: ParentDetails, required: false},

//     previousSchool: PreviousSchool,

//     address: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "Address",
//         required: true,
//     },

//     documents: [Document],

//     admissionYear: { type: Number, required: true },

//     status: {
//         type: String,
//         enum: Object.values(Enum.StudentStatus),
//         default: Enum.StudentStatus.ACTIVE,
//         required: true,
//     },
// }, { timestamps: true, });

// studentSchema.pre("save", async function (next) {
//     if (!this.enrollmentNumber) {
//         const year = this.admissionYear;
//         let unique = false;
//         let registrationNumber = "";
//         while (!unique) {
//             const randomNumber = Math.floor(100000 + Math.random() * 900000);
//             registrationNumber = `TCMS${year}${randomNumber}`;
//             const existingStudent = await mongoose.models.Student.findOne({
//                 enrollmentNumber: registrationNumber
//             });
//             if (!existingStudent) {
//                 unique = true;
//             }
//         }
//         this.enrollmentNumber = registrationNumber;
//     }
//     next();
// });

// export default mongoose.model<IStudent>("Student", studentSchema);



import mongoose from "mongoose";
import { IStudent } from './student.dto';
import * as Enum from "../common/constant/enum";

// Parent details sub-schema
const ParentDetails = {
    _id: false,
    name: { type: String, required: false },
    qualification: { type: String, required: false },
    occupation: { type: String, required: false },
    businessOrEmployerName: { type: String, required: false },
    officeAddress: { type: String, required: false },
    officeNumber: { type: String, required: false },
    email: { type: String, required: false },
    contactNumber: { type: String, required: false },
};

// Document sub-schema
const Document = {
    _id: false,
    name: { type: String, required: false },
    documentNumber: { type: String, required: false },
    url: { type: String, required: false },
};

// Previous school sub-schema
const PreviousSchool = {
    _id: false,
    name: { type: String, required: false },
    address: { type: String, required: false },
    reasonForLeaving: { type: String, required: false },
    dateOfLeaving: { type: Date, required: false },
    schoolLeavingCertificate: { type: Document, required: false },
    transferCertificate: { type: Document, required: false },
};

// Student schema
const studentSchema = new mongoose.Schema<IStudent>(
  {
    enrollmentNumber: { type: String, unique: true, required: false },
    name: { type: String, required: false },
    dob: { type: Date, required: false },
    gender: { type: String, enum: Object.values(Enum.Gender), required: false },
    nationality: { type: String, required: false },
    religion: { type: String, enum: Object.values(Enum.Religion), required: false },
    motherTongue: { type: String, required: false },
    image: { type: String, required: false },
    adharNumber: { type: String, unique: true, required: false },
    contactNumber: { type: String, required: false },
    email: { type: String, required: false },
    bloodGroup: { type: String, enum: Object.values(Enum.BloodGroup), required: false },

    father: { type: ParentDetails, required: false },
    mother: { type: ParentDetails, required: false },
    localGuardian: { type: ParentDetails, required: false },

    previousSchool: { type: PreviousSchool, required: false },

    address: { type: mongoose.Schema.Types.ObjectId, ref: "Address", required: false },

    documents: { type: [Document], required: false },

    admissionYear: { type: Number, required: false },

    status: {
      type: String,
      enum: Object.values(Enum.StudentStatus),
      default: Enum.StudentStatus.ACTIVE,
      required: false,
    },
  },
  { timestamps: true }
);

// Optional: generate enrollmentNumber only if present
studentSchema.pre("save", async function (next) {
  if (this.isNew && !this.enrollmentNumber && this.admissionYear) {
    const year = this.admissionYear;
    let unique = false;
    let registrationNumber = "";
    while (!unique) {
      const randomNumber = Math.floor(100000 + Math.random() * 900000);
      registrationNumber = `TCMS${year}${randomNumber}`;
      const existingStudent = await mongoose.models.Student.findOne({
        enrollmentNumber: registrationNumber,
      });
      if (!existingStudent) unique = true;
    }
    this.enrollmentNumber = registrationNumber;
  }
  next();
});

export default mongoose.model<IStudent>("Student", studentSchema);
