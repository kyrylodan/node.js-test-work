import {authController} from "../controllers/auth.controller";
import {Router} from "express";
import {commonMiddleware} from "../middlewares/common.middleware";
import {UserValidator} from "../validator/user.validator";
import {authMiddleware} from "../middlewares/auth.middleware";

const router = Router();

router.post("/sign-up",
    commonMiddleware.isBodyValid(UserValidator.create),
    authController.signUp
);

router.post("/sign-in",
    commonMiddleware.isBodyValid(UserValidator.signIn),
    authController.signIn
);
router.post("/logout", authMiddleware, authController.logout);
router.post("/logout-all", authMiddleware, authController.logoutAll);


export default router;