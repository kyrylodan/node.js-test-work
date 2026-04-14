import { ApiError } from "../errors/api.error";
import { tokenRepository } from "../repositories/token.repositories";
import { tokenService } from "../services/token.service";
import { TokenTypeEnum } from "../enums/token-type.enum";
import { NextFunction, Request, Response } from "express";
import { Types } from "mongoose";

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



        res.locals.userId = userId;
        res.locals.role = payload.role;
        res.locals.jwtPayload = payload;
        res.locals.accessToken = accessToken;



        next();
    } catch (e) {
        next(e);
    }
};