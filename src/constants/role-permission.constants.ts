import {PermissionEnum} from "../enums/permission.enum";

export const rolePermissions = {
    buyer: [], // покупець нічого не редагує
    seller: [PermissionEnum.CREATE_CAR, PermissionEnum.EDIT_CAR,PermissionEnum.VIEW_STATISTICS],
    manager: [PermissionEnum.BAN_USER, PermissionEnum.UNBAN_USER, PermissionEnum.EDIT_CAR], // менеджер може бан/розбан
    admin: Object.values(PermissionEnum), // адмін може все
};