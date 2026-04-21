import { PermissionEnum } from "../enums/permission.enum";
import { ApiError } from "../errors/api.error";
import { IUser } from "../interfaces/user.interface";
import { getRolePermissions } from "../utils/user-role.util";

class PermissionService {
    public check(user: Pick<IUser, "role">, permission: PermissionEnum) {
        const permissions = getRolePermissions(user);
        if (!permissions.includes(permission)) {
            throw new ApiError("Forbidden: insufficient permissions", 403);
        }
    }
}

export const permissionService = new PermissionService();
