import { Router } from "express";

import { accountController } from "../controllers/account.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { commonMiddleware } from "../middlewares/common.middleware";
import { AccountValidator } from "../validator/account.validator";

const router = Router();

router.post(
    "/buy-premium",
    authMiddleware,
    commonMiddleware.isBodyValid(AccountValidator.buyPremium),
    accountController.buyPremium
);

export const accountRouter = router;
