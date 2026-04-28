import { ApiError } from "../errors/api.error";
import { tokenRepository } from "../repositories/token.repositories";
import { tokenService } from "../services/token.service";
import { TokenTypeEnum } from "../enums/token-type.enum";
import { NextFunction, Request, Response } from "express";
import { Types } from "mongoose";
import { userRepository } from "../repositories/user.repository";
import { getRoleName, getRolePermissions } from "../utils/user-role.util";

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const header = req.headers.authorization;

        if (!header) throw new ApiError("Token is not provided", 401);

        const accessToken = header.split("Bearer ")[1];

        if (!accessToken) throw new ApiError("Token is not provided", 401);

        const payload = tokenService.verifyToken(accessToken, TokenTypeEnum.ACCESS);

        const userId = payload.userId?.toString();


        if (!userId || !Types.ObjectId.isValid(userId)) {
            throw new ApiError("Invalid user ID in token", 401);
        }

        const tokenInDb = await tokenRepository.findByParams({ accessToken } as any);

        if (!tokenInDb) throw new ApiError("Token is not valid", 401);

        const user = await userRepository.getById(userId);
        if (!user) throw new ApiError("User not found", 401);
        if (user.banned) throw new ApiError("User is banned", 403);
        if (user.isDeleted) throw new ApiError("User is deleted", 403);

        res.locals.userId = userId;
        res.locals.role = getRoleName(user);
        res.locals.permissions = getRolePermissions(user);
        res.locals.jwtPayload = payload;
        res.locals.accessToken = accessToken;



        next();
    } catch (e) {
        next(e);
    }
};

export const refreshMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const header = req.headers.authorization;

        if (!header) throw new ApiError("Token is not provided", 401);

        const refreshToken = header.split("Bearer ")[1];

        if (!refreshToken) throw new ApiError("Token is not provided", 401);

        const payload = tokenService.verifyToken(refreshToken, TokenTypeEnum.REFRESH);

        const tokenInDb = await tokenRepository.getByRefreshToken(refreshToken);
        if (!tokenInDb) throw new ApiError("Token is not valid", 401);

        const user = await userRepository.getById(payload.userId);
        if (!user) throw new ApiError("User not found", 401);
        if (user.banned) throw new ApiError("User is banned", 403);
        if (user.isDeleted) throw new ApiError("User is deleted", 403);

        res.locals.userId = payload.userId;
        res.locals.role = getRoleName(user);
        res.locals.permissions = getRolePermissions(user);
        res.locals.refreshToken = refreshToken;

        next();
    } catch (e) {
        next(e);
    }
};
