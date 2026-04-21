import type { IRole } from "./role.interface";

export interface IUser {
    name:string;
    _id:string;
    age:number;
    email:string;
    password:string;
    isVerified: boolean;
    isDeleted: boolean;
    accountType?: "basic" | "premium";
    role: IRole | string;
    banned: boolean;

}
