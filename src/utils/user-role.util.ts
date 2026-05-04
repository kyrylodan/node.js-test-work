import { IRole } from "../interfaces/role.interface";
import { IUser } from "../interfaces/user.interface";

const isRoleObject = (role: IUser["role"]): role is IRole => {
    return typeof role === "object" && role !== null && "name" in role;
};

export const getRoleName = (user: Pick<IUser, "role">): string => {
    if (isRoleObject(user.role)) {
        return user.role.name;
    }

    return String(user.role);
};

export const getRolePermissions = (user: Pick<IUser, "role">): string[] => {
    if (isRoleObject(user.role)) {
        return user.role.permissions || [];
    }

    return [];
};
