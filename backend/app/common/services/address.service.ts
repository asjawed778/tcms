import { IAddress, ICreateAddress } from "../dto/address.dto";
import addressSchema from "../schema/address.schema";
import createHttpError from "http-errors";

export const saveAddress = async (
    data: ICreateAddress & { addressId?: string },
    addressId?: string
) => {
    const id = addressId || data.addressId;

    if (id) {
        const { addressId: _remove, ...updateData } = data;
        const updatedAddress = await addressSchema.findByIdAndUpdate(
            id,
            { $set: updateData },
            { new: true }
        );
        if (!updatedAddress) throw createHttpError(404, "Address not found");
        return updatedAddress as IAddress;
    }

    const newAddress = await addressSchema.create(data);
    if (!newAddress) {
        throw createHttpError(500, "Failed to create address");
    }
    return newAddress as IAddress;
};


export const getAddressById = async (addressId: string) => {
    const address = await addressSchema.findById(addressId);
    if (!address) {
        throw createHttpError(404, "Address Not found")
    }
    return address;
}

