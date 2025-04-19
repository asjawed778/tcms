import mongoose from 'mongoose';
import { IEmployee } from './employee.dto';
import { Gender } from '../common/constant/enum';

const employeeSchema = new mongoose.Schema<IEmployee>({
    employeeId: {
        type: String,
        unique: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: false
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true
    },
    phoneNumber: {
        type: String,
        required: true
    },
    address: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Address",
        required: true,
    },
    dateOfJoining: {
        type: Date,
        required: true
    },
    experience: [{
        organisationName: {
            type: String,
            required: true,
        },
        years: {
            type: Number,
            required: true,
        },
        designation: {
            type: String,
            required: true,
        },
    }],
    dateOfLeaving: {
        type: Date
    },
    isActive: {
        type: Boolean,
        default: true
    },
    salary: {
        type: Number,
        required: true
    },
    gender: {
        type: String,
        enum: Object.values(Gender)
    },
    dob: {
        type: Date,
        required: true
    },
    photo: {
        type: String,
        required: false
    },
    aadhaarNumber: {
        type: Number,
        required: true
    },
    documents: [{
        name: {
            type: String,
            required: true,
        },
        documentNumber: {
            type: String,
            required: false,
        },
        url: {
            type: String,
            required: true,
        },
    }],
}, { timestamps: true, });

employeeSchema.pre("save", async function (next) {
    const doc = this as mongoose.Document & {
        isNew: boolean;
        employeeId: string;
    };

    if (doc.isNew && !doc.employeeId) {
        let unique = false;
        while (!unique) {
            const randomId = "TCMS" + Math.floor(10000000 + Math.random() * 90000000);
            const existing = await mongoose.models.Faculty.findOne({ employeeId: randomId });
            if (!existing) {
                doc.employeeId = randomId;
                unique = true;
            }
        }
    }

    next();
});

export default mongoose.model<IEmployee>('Employee', employeeSchema);