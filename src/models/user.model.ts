import { IUser } from "../interfaces/user.interface"
import {UserRoleEnum} from "../enums/user-role.enum";
import {AccountTypeEnum} from "../enums/account-type.enum";
import {model, Schema} from "mongoose";
const userSchema = new Schema<IUser>({
    name:{type: String, required: true},
    age: {type: Number, required: true},
    email: {type: String, required: true},
    password: {type: String, required: true},
    role: {
        type: String,
        enum: Object.values(UserRoleEnum),
        default: UserRoleEnum.SELLER
    },
    accountType: {
        type: String,
        enum: Object.values(AccountTypeEnum),
        default: AccountTypeEnum.BASIC
    },
    permissions: {
        type: [String],
        default: []
    },
    isVerified: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false }



})
export const User = model<IUser>('User', userSchema)