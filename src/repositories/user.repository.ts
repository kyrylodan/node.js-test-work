import {IUser} from "../interfaces/user.interface";
import {User} from "../models/user.model";
import {ApiError} from "../errors/api.error";
import { Types } from "mongoose";

class UserRepository {
    public async getById(userId: string): Promise<IUser> {


        const user = await User.findById(userId);



        return user;
    }


    public async getByEmail(email:string):Promise<IUser> {
        return User.findOne({email})
    }
    public async create(dto:Partial<IUser>):Promise<IUser> {
        return User.create(dto)
    }

    public async updateById(userId:string,dto:Partial<IUser>):Promise<IUser> {
        const user = await User.findByIdAndUpdate(userId,dto, {new:true})
        if(!user) throw new ApiError ('User not found', 404)
        return user
    }

    public async deleteById(userId:string):Promise<void> {
        await User.findByIdAndDelete(userId)
    }

}

export const userRepository = new UserRepository()