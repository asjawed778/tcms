import { BaseSchema } from "./base.dto";

export interface IAddress extends BaseSchema {
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    country: string;
    pincode: number;
}

export interface ICreateAddress extends Omit<IAddress, "createdAt" | "updatedAt" | "_id"> {} 