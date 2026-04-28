import {PermissionEnum} from "../enums/permission.enum";

export const rolePermissions = {
    buyer: [],
    seller: [
        PermissionEnum.CREATE_CAR,
        PermissionEnum.EDIT_CAR,
        PermissionEnum.VIEW_STATISTICS,
    ],
    manager: [
        PermissionEnum.BAN_USER,
        PermissionEnum.UNBAN_USER,
        PermissionEnum.EDIT_CAR,
        PermissionEnum.MANAGE_USERS,
    ],
    admin: Object.values(PermissionEnum),
};
