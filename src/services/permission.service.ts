import { PermissionEnum } from "../enums/permission.enum";
import { rolePermissions } from "../constants/role-permission.constants";
import { ApiError } from "../errors/api.error";

class PermissionService {
    public check(userRole: keyof typeof rolePermissions, permission: PermissionEnum) {
        const permissions = rolePermissions[userRole];
        if (!permissions || !permissions.includes(permission)) {
            throw new ApiError("Forbidden: insufficient permissions", 403);
        }
    }
}

export const permissionService = new PermissionService();