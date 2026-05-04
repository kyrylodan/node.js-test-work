import { rolePermissions } from "../constants/role-permission.constants";
import { UserRoleEnum } from "../enums/user-role.enum";
import { ApiError } from "../errors/api.error";
import { IRole } from "../interfaces/role.interface";
import { User } from "../models/user.model";
import { roleRepository } from "../repositories/role.repository";
import { Types } from "mongoose";

class RoleService {
    public async seedDefaultRoles(): Promise<void> {
        const rolesToSeed: Array<Pick<IRole, "name" | "permissions" | "description" | "isActive">> = [
            {
                name: UserRoleEnum.BUYER,
                permissions: rolePermissions[UserRoleEnum.BUYER],
                description: "Buyer role with limited marketplace access",
                isActive: true,
            },
            {
                name: UserRoleEnum.SELLER,
                permissions: rolePermissions[UserRoleEnum.SELLER],
                description: "Seller role that can manage own cars and statistics",
                isActive: true,
            },
            {
                name: UserRoleEnum.MANAGER,
                permissions: rolePermissions[UserRoleEnum.MANAGER],
                description: "Manager role that can moderate users and cars",
                isActive: true,
            },
            {
                name: UserRoleEnum.ADMIN,
                permissions: rolePermissions[UserRoleEnum.ADMIN],
                description: "Administrator role with full access",
                isActive: true,
            },
        ];

        await Promise.all(
            rolesToSeed.map((role) => roleRepository.upsertByName(role)),
        );
    }

    public async getByNameOrThrow(name: string): Promise<IRole> {
        const role = await roleRepository.getByName(name);

        if (!role || !role.isActive) {
            throw new ApiError(`Role ${name} not found`, 404);
        }

        return role;
    }

    public async getDefaultRole(): Promise<IRole> {
        return await this.getByNameOrThrow(UserRoleEnum.SELLER);
    }

    public async migrateLegacyUserRoles(): Promise<number> {
        const roleNames = Object.values(UserRoleEnum);
        let migratedUsersCount = 0;

        for (const roleName of roleNames) {
            const role = await this.getByNameOrThrow(roleName);
            const result = await User.collection.updateMany(
                { role: roleName },
                { $set: { role: new Types.ObjectId(role._id) } },
            );

            migratedUsersCount += result.modifiedCount;
        }

        return migratedUsersCount;
    }
}

export const roleService = new RoleService();
