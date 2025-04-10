import { ClientSession } from "mongoose";
import { IAddress, ICreateAddress } from "../dto/address.dto";
import addressSchema from "../schema/address.schema";

export const createAddress = async (data: ICreateAddress, session?: ClientSession) => {
    const [address] = await addressSchema.create([data], { session });
    return address as IAddress;
}