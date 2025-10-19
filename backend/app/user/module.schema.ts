import mongoose from "mongoose";
import { IModule } from "./user.dto";


const moduleSchema = new mongoose.Schema<IModule>(
    {
        name: { type: String, required: true },
        subModules: [{
            name: {
                type: String,
                required: true,
                trim: true
            },
        }],
    },
    { timestamps: true }
);

export default mongoose.model<IModule>("Module", moduleSchema);