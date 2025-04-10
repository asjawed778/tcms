import { ClientSession } from "mongoose";
import { ICreateEmployee, IEmployee } from "./employee.dto";
import employeeSchema from "./employee.schema";

export const createEmployee = async (data: ICreateEmployee, session?: ClientSession) => {
    const [result] = await employeeSchema.create([{...data}], {session});
    return result as IEmployee;
};

