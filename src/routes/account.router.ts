import { Router } from "express";
import { accountController } from "../controllers/account.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();


router.post("/buy-premium", authMiddleware, accountController.buyPremium);

export const accountRouter = router;