import {model, Schema} from "mongoose";
import {IModel} from "../interfaces/model.interface";

const modelSchema = new Schema<IModel>({
    name: { type: String, required: true },
    brandId: { type: Schema.Types.ObjectId, ref: "Brand", required: true },

}, { collection: "models" });

export const ModelModel = model<IModel>("Model", modelSchema);
