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

class AuthService {
    public async signUp(dto: ISignUp):Promise<{user:IUser, token:ITokenPair}>{
        await this.isEmailExistOrThrow(dto.email)

        const password = await passwordService.hashPassword(dto.password)

        const user = await userRepository.create({...dto,password})

        const token = await tokenService.generateTokens({
            userId: user._id.toString(),
            role: user.role
        });

        await tokenRepository.create({...token, _userId:user._id})

        await emailService.sendMail(
            user.email,
            EmailTypeEnum.WELLCOME,
            {name:user.name}
        )

        return {user,token}
    }

    public async signIn(dto: ISignIn):Promise<{user:IUser, token:ITokenPair}> {

        const user = await userRepository.getByEmail(dto.email)
        if(!user){
            throw new ApiError('User not found',404)
        }
        const isPasswordCorrect = await passwordService.comparePassword(dto.password,user.password)
        if(!isPasswordCorrect){
            throw new ApiError('Password is incorrect',401)
        }
        const token = tokenService.generateTokens({userId: user._id.toString(),role:user.role})

        await tokenRepository.create({...token, _userId:user._id})

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

        await emailService.sendMail(
            user.email,
            EmailTypeEnum.WELLCOME,
            {name:user.name}
        )
    }

    public async logoutAll(userId:string):Promise<void> {
        const user = await userRepository.getById(userId)
        if(!user){
            throw new ApiError('User not found',404)
        }
        await tokenRepository.deleteByParams({_userId:userId} as any)

        await emailService.sendMail(
            user.email,
            EmailTypeEnum.WELLCOME,
            {name:user.name}
        )
    }

    private async isEmailExistOrThrow(email:string):Promise<void> {
        const user = await userRepository.getByEmail(email)
        if(user){
            throw new ApiError('Email already exist',409)
        }
    }
}

export const authService = new AuthService()