import {ISignIn, ISignUp} from "../interfaces/auth.interface";
import {IUser} from "../interfaces/user.interface";
import {ITokenPair} from "../interfaces/token.interface";
import {userRepository} from "../repositories/user.repository";
import { ApiError } from "../errors/api.error";
import {passwordService} from "./password.service";
import {tokenService} from "./token.service";
import {tokenRepository} from "../repositories/token.repositories";
import {emailService} from "./email.service";
import { EmailTypeEnum } from "../enums/email-type.enum";
import {TokenTypeEnum} from "../enums/token-type.enum";
import { roleService } from "./role.service";
import { getRoleName } from "../utils/user-role.util";

class AuthService {
    public async signUp(dto: ISignUp):Promise<{user:IUser, token:ITokenPair}>{
        await this.isEmailExistOrThrow(dto.email)

        const password = await passwordService.hashPassword(dto.password)
        const role = dto.role
            ? await roleService.getByNameOrThrow(dto.role)
            : await roleService.getDefaultRole();

        const userData: Partial<IUser> = {
            name: dto.name,
            age: dto.age,
            email: dto.email,
            password,
            role: role._id,
        };

        if (dto.accountType) {
            userData.accountType = dto.accountType;
        }

        const user = await userRepository.create(userData)

        const token = await tokenService.generateTokens({
            userId: user._id.toString(),
            role: getRoleName(user)
        });

        await tokenRepository.create({
            ...token,
            _userId:user._id,
            refreshTokenExpiresAt: tokenService.getRefreshTokenExpiresAt(),
        })

        await emailService.sendMail(
            user.email,
            EmailTypeEnum.WELLCOME,
            {name:user.name}
        )

        const { password: _, ...userWithoutPassword } = user as any;
        return { user: userWithoutPassword, token };
    }

    public async signIn(dto: ISignIn):Promise<{user:IUser, token:ITokenPair}> {

        const user = await userRepository.getByEmail(dto.email, true)
        if(!user){
            throw new ApiError('User not found',404)
        }
        const isPasswordCorrect = await passwordService.comparePassword(dto.password,user.password)
        if(!isPasswordCorrect){
            throw new ApiError('Password is incorrect',401)
        }
        const token = tokenService.generateTokens({
            userId: user._id.toString(),
            role: getRoleName(user)
        })

        await tokenRepository.create({
            ...token,
            _userId:user._id,
            refreshTokenExpiresAt: tokenService.getRefreshTokenExpiresAt(),
        })

        const { password: _, ...userWithoutPassword } = user as any;
        return { user: userWithoutPassword, token };
    }

    public async logout(accessToken:string):Promise<void> {
        const token = await tokenRepository.findByParams({accessToken} as any)
        if(!token){
            throw new ApiError('Token not found',404)
        }
        const user = await userRepository.getById(token._userId)
        if(!user){
            throw new ApiError('User not found',404)
        }
        await tokenRepository.deleteByParams({accessToken} as any)


    }

    public async logoutAll(userId:string):Promise<void> {
        const user = await userRepository.getById(userId)
        if(!user){
            throw new ApiError('User not found',404)
        }
        await tokenRepository.deleteByParams({_userId:userId} as any)


    }

    public async refresh(refreshToken: string): Promise<ITokenPair> {
        const payload = tokenService.verifyToken(refreshToken, TokenTypeEnum.REFRESH);

        const tokenInDb = await tokenRepository.getByRefreshToken(refreshToken);
        if (!tokenInDb) {
            throw new ApiError("Token is not valid", 401);
        }

        const user = await userRepository.getById(payload.userId);
        if (!user) {
            throw new ApiError("User not found", 404);
        }

        await tokenRepository.deleteByParams({ refreshToken } as any);

        const newTokenPair = tokenService.generateTokens({
            userId: user._id.toString(),
            role: getRoleName(user)
        });

        await tokenRepository.create({
            ...newTokenPair,
            _userId: user._id,
            refreshTokenExpiresAt: tokenService.getRefreshTokenExpiresAt(),
        });

        return newTokenPair;
    }

    private async isEmailExistOrThrow(email:string):Promise<void> {
        const user = await userRepository.getByEmail(email)
        if(user){
            throw new ApiError('Email already exist',409)
        }
    }
}

export const authService = new AuthService()
