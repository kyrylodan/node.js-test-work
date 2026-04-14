import { Request, Response, NextFunction } from "express";
import { ApiError } from "../errors/api.error";
import {rolePermissions} from "../constants/role-permission.constants";

export const permissionMiddleware = (permission: string) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const role = res.locals.role;
        if (!role) return next(new ApiError("No role found", 403));

        const permissions = rolePermissions[role] || [];
        if (!permissions.includes(permission)) {
            return next(new ApiError("Forbidden", 403));
        }
        next();
    };
};