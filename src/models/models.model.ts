import {model, Schema} from "mongoose";
import {IModel} from "../interfaces/model.interface";

const modelSchema = new Schema<IModel>({
    name: { type: String, required: true },
    brandId: { type: String, required: true },

}, { collection: "models" });

export const ModelModel = model<IModel>("Model", modelSchema);