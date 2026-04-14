import {NextFunction, Request, Response} from "express";
import {IUser} from "../interfaces/user.interface";
import {authService} from "../services/auth.service";
import {ISignIn} from "../interfaces/auth.interface";

class AuthController {
    public async signIn (req: Request, res: Response, next: NextFunction)  {
        try{
            const dto = req.body as ISignIn;
            const result = await authService.signIn(dto);
            res.status(200).json(result);
        }catch (e) {
            next(e);
        }
    }

    public async signUp (req: Request, res: Response, next: NextFunction)  {
       try{
           const dto = req.body as IUser;
           const result = await authService.signUp(dto);
           res.status(201).json(result);
       }catch (e) {
           next(e);
       }
    }

    public async logout(req: Request, res: Response, next: NextFunction) {
        try {
            const accessToken = res.locals.accessToken;
            await authService.logout(accessToken);
            res.status(200).json({ message: "Logged out successfully" });
        } catch (e) {
            next(e);
        }
    }

    public async logoutAll (req: Request, res: Response, next: NextFunction)  {
        try{
            const userId = res.locals.userId;
            await authService.logoutAll(userId);
            res.status(200).json({});
        }catch (e) {
            next(e);
        }
    }
}

export const authController = new AuthController()