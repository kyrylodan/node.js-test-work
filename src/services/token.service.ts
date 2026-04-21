import jwt, { SignOptions } from "jsonwebtoken";

import { configs } from "../configs/config";
import { TokenTypeEnum } from "../enums/token-type.enum";
import { ApiError } from "../errors/api.error";
import { ITokenPair, ITokenPayload } from "../interfaces/token.interface";
import { getTokenExpirationDate } from "../utils/token-expiration.util";

class TokenServise {
    public generateTokens(payload: ITokenPayload): ITokenPair {
        const accessExpiresIn = configs.JWT_ACCESS_EXPIRATION as NonNullable<SignOptions["expiresIn"]>;
        const refreshExpiresIn = configs.JWT_REFRESH_EXPIRATION as NonNullable<SignOptions["expiresIn"]>;

        const accessToken = jwt.sign(
            { userId: payload.userId.toString(), role: payload.role },
            configs.JWT_ACCESS_SECRET,
            { expiresIn: accessExpiresIn },
        );

        const refreshToken = jwt.sign(
            { userId: payload.userId.toString(), role: payload.role },
            configs.JWT_REFRESH_SECRET,
            { expiresIn: refreshExpiresIn },
        );

        return { accessToken, refreshToken };
    }

    public getRefreshTokenExpiresAt(): Date {
        return getTokenExpirationDate(configs.JWT_REFRESH_EXPIRATION);
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
                default:
                    throw new ApiError("Invalid token type", 401);
            }

            return jwt.verify(token, secret) as ITokenPayload;
        } catch (e) {
            const error = e as Error;
            console.error(error.message);
            throw new ApiError("Invalid token", 401);
        }
    }
}

export const tokenService = new TokenServise();
