import { NextFunction, Request, Response } from "express";

import {accountService} from "../services/account.service";

class AccountController {
    public async buyPremium(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = res.locals.userId;
            const { paymentStatus, paymentReference, paymentSignature } = req.body;

            const updatedUser = await accountService.buyPremium(userId, {
                paymentStatus,
                paymentReference,
                paymentSignature,
            });

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
