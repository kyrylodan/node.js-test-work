import { model, Schema } from "mongoose";
import {IBrand} from "../interfaces/brand.interface";


const brandSchema = new Schema<IBrand>({
    name: { type: String, required: true, unique: true },
    models: { type: [String], required: true },
}, { timestamps: true });

export const Brand = model<IBrand>("Brand", brandSchema);