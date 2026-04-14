import { Request, Response, NextFunction } from "express";
import {accountService} from "../services/account.service";

class AccountController {
    public async buyPremium(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = res.locals.userId;
            const { paymentStatus } = req.body;

            const updatedUser = await accountService.buyPremium(userId, paymentStatus);

            res.status(200).json({
                message: "Premium account activated successfully",
                user: updatedUser
            });
        } catch (e) {
            next(e);
        }
    }
}

export const accountController = new AccountController();