import { BaseSchema } from "../common/dto/base.dto";

export interface IEmployeeId extends BaseSchema {
    employeeId: string;
}

export interface ICreateEmployeeId extends Omit<IEmployeeId, "employeeId" | "createdAt" | "updatedAt" | "_id"> {}