import { ICreateEmployee } from "./employee.dto";
import employeeSchema from "./employee.schema";

export const createEmployee = async (data: ICreateEmployee) => {
    const result = await employeeSchema.create(data);
    return result;
};

