import { Types } from "mongoose";

export interface IModel {
    _id: string;
    name: string;
    brandId: string | Types.ObjectId;
}
