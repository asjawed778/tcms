import mongoose, { Schema, Document } from 'mongoose';

export interface IEmployee extends Document {
    employeeId: string; // Unique identifier for the employee
    name: string;
    role: 'teacher' | 'staff';
    email: string;
    phone: string;
    address: string;
    dateOfJoining: Date;
    dateOfLeaving?: Date; // Optional field for when the employee leaves
    isActive: boolean;
    salary: number; // Salary of the employee
    paymentHistory: {
        date: Date;
        amount: number;
        method: string; // e.g., 'bank transfer', 'cash'
    }[];
}

const EmployeeSchema: Schema = new Schema(
    {
        employeeId: { type: String, required: true, unique: true }, // Unique ID
        name: { type: String, required: true },
        role: { type: String, enum: ['teacher', 'staff'], required: true },
        email: { type: String, required: true, unique: true },
        phone: { type: String, required: true },
        address: { type: String, required: true },
        dateOfJoining: { type: Date, required: true },
        dateOfLeaving: { type: Date }, // Optional field
        isActive: { type: Boolean, default: true },
        salary: { type: Number, required: true }, // Salary field
        paymentHistory: [
            {
                date: { type: Date, required: true },
                amount: { type: Number, required: true },
                method: { type: String, required: true },
            },
        ],
    },
    {
        timestamps: true,
    }
);

export default mongoose.model<IEmployee>('Employee', EmployeeSchema);