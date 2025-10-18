import { ClientSession } from "mongoose";
import employeeSchema from "./employee.schema";


export const createEmployeeId = async (session?: ClientSession) => {
    let isUnique = false;
    let newId = '';

    while (!isUnique) {
        const randomId = "TCMS" + Math.floor(10000000 + Math.random() * 90000000);
        const existing = await employeeSchema.findOne({ employeeId: randomId }).session(session || null);

        if (!existing) {
            newId = randomId;
            isUnique = true;
        }
    }

    const newEmployeeId = new employeeSchema({ employeeId: newId });

    await newEmployeeId.save({ session });

    return newEmployeeId.employeeId.toString();
};
