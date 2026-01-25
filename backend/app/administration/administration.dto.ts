import { BaseSchema } from "../common/dto/base.dto";


export interface IClassName extends BaseSchema {
    name: string;
    slug: string;
    order?: number;
    isActive: boolean;
};
export interface IClassNameCreate extends Omit<IClassName, "_id" | "createdAt" | "updatedAt"> {}

export interface IPeriodType extends BaseSchema {
    name: string;
    slug: string;
    isActive: boolean;
};

export interface ISubjectCategory extends BaseSchema {
    name: string;
    slug: string;
    isActive: boolean;
};