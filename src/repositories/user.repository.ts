import {IUser} from "../interfaces/user.interface";
import {User} from "../models/user.model";
import {ApiError} from "../errors/api.error";

class UserRepository {
    public async getById(userId: string): Promise<IUser | null> {
        return await User.findById(userId).select("-password").populate("role");
    }


    public async getByEmail(email:string, includePassword = false):Promise<IUser | null> {
        const query = User.findOne({email}).populate("role");

        if (includePassword) {
            query.select("+password");
        } else {
            query.select("-password");
        }

        return await query;
    }
    public async create(dto:Partial<IUser>):Promise<IUser> {
        const user = await User.create(dto);

        const createdUser = await User.findById(user._id).select("-password").populate("role");
        if (!createdUser) {
            throw new ApiError("User not found", 404);
        }

        return createdUser;
    }

    public async updateById(userId:string,dto:Partial<IUser>):Promise<IUser> {
        const user = await User.findByIdAndUpdate(userId,dto, {new:true}).select("-password").populate("role")
        if(!user) throw new ApiError ('User not found', 404)
        return user
    }

    public async deleteById(userId:string):Promise<void> {
        await User.findByIdAndDelete(userId)
    }

}

export const userRepository = new UserRepository()
