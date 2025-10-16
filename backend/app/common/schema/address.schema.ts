import mongoose from "mongoose";
import { IAddress } from "../dto/address.dto";


const AddressSchema = new mongoose.Schema<IAddress>({
  addressLine1: { type: String, required: false },
  addressLine2: { type: String },
  city: { type: String, required: false },
  state: { type: String, required: false },
  country: { type: String, required: false },
  pincode: { type: Number, required: false }
},
  { timestamps: true }
);

export default mongoose.model<IAddress>('Address', AddressSchema);


