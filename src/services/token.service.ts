import { configs } from "../configs/config";
import { TokenTypeEnum } from "../enums/token-type.enum";
import {ITokenPair, ITokenPayload} from "../interfaces/token.interface";
import {ApiError} from "../errors/api.error";
import jwt, { SignOptions } from "jsonwebtoken";

class TokenServise {
    public generateTokens(payload: ITokenPayload): ITokenPair {
        // payload.userId має бути рядком ObjectId, а не об'єкт
        const accessToken = jwt.sign(
            { userId: payload.userId.toString(), role: payload.role }, // <- саме так
            configs.JWT_ACCESS_SECRET,
            { expiresIn: configs.JWT_ACCESS_EXPIRATION as SignOptions["expiresIn"] }
        );

        const refreshToken = jwt.sign(
            { userId: payload.userId.toString(), role: payload.role },
            configs.JWT_REFRESH_SECRET,
            { expiresIn: configs.JWT_REFRESH_EXPIRATION as SignOptions["expiresIn"] }
        );

        return { accessToken, refreshToken };
    }

    public verifyToken(token: string, type: TokenTypeEnum): ITokenPayload {
        try {
            let secret: string;

            switch (type) {
                case TokenTypeEnum.ACCESS:
                    secret = configs.JWT_ACCESS_SECRET;
                    break;

                case TokenTypeEnum.REFRESH:
                    secret = configs.JWT_REFRESH_SECRET;
                    break;
            }
            return jwt.verify(token, secret) as ITokenPayload;
        } catch (e) {
            console.error(e.message);
            throw new ApiError("Invalid token", 401);
        }
    }
}

export const tokenService = new TokenServise();