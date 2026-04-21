import { ApiError } from "../errors/api.error";
import { IUser } from "../interfaces/user.interface";
import {userRepository} from "../repositories/user.repository";
import {passwordService} from "./password.service";
import {UserRoleEnum} from "../enums/user-role.enum";
import { roleService } from "./role.service";

type CreateManagerDto = Pick<IUser, "name" | "age" | "email" | "password">;

class UserService {


    public async create(dto: Partial<IUser>): Promise<IUser> {
        const { name, age, email, password } = dto;

        if (!name || name.length < 3) {
            throw new ApiError("Name must be at least 3 characters", 400);
        }

        if (!email || !email.includes("@")) {
            throw new ApiError("Invalid email", 400);
        }

        if (!password || password.length < 6) {
            throw new ApiError("Password must be 6+ characters", 400);
        }

        if (!age) {
            throw new ApiError("Age is required", 400);
        }
        if (!dto.accountType) {
            dto.accountType = 'basic';
        }

        const role = dto.role
            ? await roleService.getByNameOrThrow(String(dto.role))
            : await roleService.getDefaultRole();

        return userRepository.create({
            name,
            age,
            email,
            password,
            accountType: dto.accountType,
            role: role._id,
        });
    }


    public async getMe(userId: string): Promise<IUser> {
        const user = await userRepository.getById(userId);
        if (!user) throw new ApiError("User not found", 404);

        return user;
    }
    public async updateById(userId: string, dto: Partial<IUser>): Promise<IUser> {
        const updateUser = await userRepository.updateById(userId, dto);
        if (!updateUser) throw new ApiError("User not found", 404);

        return updateUser;
    }




    public async deleteMe(userId: string): Promise<void> {
        const user = await userRepository.getById(userId);
        if (!user) throw new ApiError("User not found", 404);

        await userRepository.deleteById(userId);
    }

    public async createManager(dto: CreateManagerDto): Promise<IUser> {
        const existingUser = await userRepository.getByEmail(dto.email);
        if (existingUser) {
            throw new ApiError("Email already exists", 409);
        }

        const hashedPassword = await passwordService.hashPassword(dto.password);
        const managerRole = await roleService.getByNameOrThrow(UserRoleEnum.MANAGER);

        return await userRepository.create({
            name: dto.name,
            age: dto.age,
            email: dto.email,
            password: hashedPassword,
            role: managerRole._id,
            accountType: "basic",
        });
    }

    public async banUser(targetUserId: string): Promise<IUser> {
        return userRepository.updateById(targetUserId, { banned: true });
    }

    public async unbanUser(targetUserId: string): Promise<IUser> {
        return userRepository.updateById(targetUserId, { banned: false });
    }




}

export const userService = new UserService();
