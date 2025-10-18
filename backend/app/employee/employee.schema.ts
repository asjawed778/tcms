import mongoose from 'mongoose';
import { IEmployeeId } from './employee.dto';

export const employeeIdSchema = new mongoose.Schema<IEmployeeId>({
    employeeId: {
        type: String,
        unique:  true
    }
}, { timestamps: true});


export default mongoose.model<IEmployeeId>('Employee', employeeIdSchema);
