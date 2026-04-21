import { Request, Response, NextFunction } from "express";
import { ApiError } from "../errors/api.error";

export const permissionMiddleware = (permission: string) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const permissions = res.locals.permissions;
        if (!permissions) return next(new ApiError("No permissions found", 403));

        if (!permissions.includes(permission)) {
            return next(new ApiError("Forbidden", 403));
        }
        next();
    };
};
