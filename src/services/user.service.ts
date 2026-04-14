import { ApiError } from "../errors/api.error";
import { ITokenPayload } from "../interfaces/token.interface";
import { IUser } from "../interfaces/user.interface";
import {userRepository} from "../repositories/user.repository";
import {PermissionEnum} from "../enums/permission.enum";
import {permissionService} from "./permission.service";
import {passwordService} from "./password.service";
import {UserRoleEnum} from "../enums/user-role.enum";


class UserService {


    public async create(dto: Partial<IUser>): Promise<IUser> {
        if (!dto.name || dto.name.length < 3) {
            throw new ApiError("Name must be at least 3 characters", 400);
        }

        if (!dto.email || !dto.email.includes("@")) {
            throw new ApiError("Invalid email", 400);
        }

        if (!dto.password || dto.password.length < 6) {
            throw new ApiError("Password must be 6+ characters", 400);
        }

        if (!dto.age) {
            throw new ApiError("Age is required", 400);
        }
        if (!dto.accountType) {
            dto.accountType = 'basic';
        }{}

        return userRepository.create(dto);
    }


    public async getMe(userId: string): Promise<IUser> {
        const user = await userRepository.getById(userId);
        if (!user) throw new ApiError("User not found", 404);

        return user;
    }
    public async updateById(userId: string, dto: Partial<IUser>): Promise<IUser> {
        const user = await userRepository.getById(userId);
        if (!user) throw new ApiError("User not found", 404);

        const updateUser = await userRepository.updateById(userId, dto);
        if (!updateUser) throw new ApiError("User not found", 404);

        return updateUser;
    }


    public async updateMe(jwtPayload: ITokenPayload, dto: Partial<IUser>): Promise<IUser> {
        const user = await userRepository.updateById(jwtPayload.userId, dto);
        if (!user) throw new ApiError("User not found", 404);

        return user;
    }


    public async deleteMe(userId: string): Promise<void> {
        const user = await userRepository.getById(userId);
        if (!user) throw new ApiError("User not found", 404);

        await userRepository.deleteById(userId);
    }

    public async createManager(adminId: string, dto: Partial<IUser>): Promise<IUser> {
        const admin = await userRepository.getById(adminId);
        if (!admin) throw new ApiError("Admin not found", 404);

        permissionService.check(admin.role, PermissionEnum.MANAGE_USERS);

        if (!dto.name || dto.name.length < 3) {
            throw new ApiError("Name must be at least 3 characters", 400);
        }

        if (!dto.email || !dto.email.includes("@")) {
            throw new ApiError("Invalid email", 400);
        }

        if (!dto.password || dto.password.length < 6) {
            throw new ApiError("Password must be 6+ characters", 400);
        }

        if (!dto.age) {
            throw new ApiError("Age is required", 400);
        }

        const existingUser = await userRepository.getByEmail(dto.email);
        if (existingUser) {
            throw new ApiError("Email already exists", 409);
        }

        const hashedPassword = await passwordService.hashPassword(dto.password);

        return await userRepository.create({
            name: dto.name,
            age: dto.age,
            email: dto.email,
            password: hashedPassword,
            role: UserRoleEnum.MANAGER,
            accountType: "basic",
        });
    }

    public async banUser(targetUserId: string, userId: string) {
        const user = await userRepository.getById(userId);
        if (!user) throw new ApiError("User not found", 404);

        // Використовуємо permissionService замість приватного методу
        permissionService.check(user.role, PermissionEnum.BAN_USER);

        return userRepository.updateById(targetUserId, { banned: true });
    }

    public async unbanUser(targetUserId: string, userId: string) {
        const user = await userRepository.getById(userId);
        if (!user) throw new ApiError("User not found", 404);

        permissionService.check(user.role, PermissionEnum.UNBAN_USER);

        return userRepository.updateById(targetUserId, { banned: false });
    }



}

export const userService = new UserService();