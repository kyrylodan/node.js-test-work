import {NextFunction, Request, Response} from "express";
import {IUser} from "../interfaces/user.interface";
import {userService} from "../services/user.service";


class UserController {

    public async create(req: Request, res: Response, next: NextFunction) {
        try{
            const user = await userService.create(req.body);
            res.status(201).json(user);
        }catch (e) {
            next(e);
        }
    }
    public async updateMe(
        req: Request<{ userId: string }>,
        res: Response,
        next: NextFunction
    ) {
        try {
            const userId = res.locals.userId;
            const dto = req.body as Partial<IUser>;
            const result = await userService.updateById(userId, dto);
            res.json(result);
        } catch (e) {
            next(e);
        }
    }
    public async getMe(req: Request, res: Response, next: NextFunction) {
        try{
            const userId = res.locals.userId;
            const result = await userService.getMe(userId);
            res.status(200).json(result);
        }catch (e) {
            next(e);
        }
    }

    public async deleteMe(req: Request, res: Response, next: NextFunction) {
        try{
            const userId = res.locals.userId;
            await userService.deleteMe(userId);
            res.status(204).send();
        }catch (e) {
            next(e);
        }
    }
    public async createManager(req: Request, res: Response, next: NextFunction) {
        try {
            const adminId = res.locals.userId;
            const dto = req.body as Partial<IUser>;

            const result = await userService.createManager(adminId, dto);

            res.status(201).json(result);
        } catch (e) {
            next(e);
        }
    }

    public async banUser(req: Request, res: Response) {
        const { targetUserId } = req.body;
        const userId = res.locals.userId;

        const result = await userService.banUser(targetUserId, userId);
        return res.json({ success: true, user: result });
    }

    public async unbanUser(req: Request, res: Response) {
        const { targetUserId } = req.body;
        const userId = res.locals.userId;

        const result = await userService.unbanUser(targetUserId, userId);
        return res.json({ success: true, user: result });
    }


}

export const userController = new UserController();