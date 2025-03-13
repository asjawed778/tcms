import { BaseSchema } from "../common/dto/base.dto";

export interface IStudent extends BaseSchema {
    studentId: string;

    //personal details
    name: string;
    
}