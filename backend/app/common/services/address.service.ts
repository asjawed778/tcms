import { IAddress, ICreateAddress } from "../dto/address.dto";
import addressSchema from "../schema/address.schema";
import createHttpError from "http-errors";


export const saveAddress = async (data: ICreateAddress & { addressId?: string }) => {
    if (data.addressId) {
        const { addressId, ...updateData } = data;
        const updatedAddress = await addressSchema.findByIdAndUpdate(
            addressId,
            updateData,
            { new: true }
        );
        if (!updatedAddress) throw createHttpError(404, "Address not found");
        return updatedAddress as IAddress;
    } else {
        const address = await addressSchema.create(data);
        return address as IAddress;
    }
};

