import { IUser } from "../interfaces/user.interface"
import {AccountTypeEnum} from "../enums/account-type.enum";
import {model, Schema} from "mongoose";
import { Role } from "./role.model";
const userSchema = new Schema<IUser>({
    name:{type: String, required: true},
    age: {type: Number, required: true},
    email: {type: String, required: true},
    password: { type: String, required: true, select: false },
    banned: {type: Boolean, default: false},
    role: {
        type: Schema.Types.ObjectId,
        ref: Role.modelName,
        required: true
    },
    accountType: {
        type: String,
        enum: Object.values(AccountTypeEnum),
        default: AccountTypeEnum.BASIC
    },
    isVerified: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false }



})
export const User = model<IUser>('User', userSchema)
