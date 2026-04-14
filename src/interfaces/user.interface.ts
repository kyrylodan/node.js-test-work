import type {UserRoleEnum} from "../enums/user-role.enum";

export interface IUser {
    name:string;
    _id:string;
    age:number;
    email:string;
    password:string;
    isVerified: boolean;
    isDeleted: boolean;
    accountType?: "basic" | "premium";
    role: UserRoleEnum;
    permissions: string[];
    banned: boolean;

}