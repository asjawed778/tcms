import mongoose from "mongoose";
import { IAddress } from "../dto/address.dto";


const AddressSchema = new mongoose.Schema<IAddress>({
  addressLine1: { type: String, required: true },
  addressLine2: { type: String },
  city: { type: String, required: true },
  state: { type: String, required: true },
  country: { type: String, required: true },
  pincode: { type: Number, required: true }
},
  { timestamps: true }
);

export default mongoose.model<IAddress>('Address', AddressSchema);


