import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { permissionMiddleware } from "../middlewares/permission.middleware";
import { commonMiddleware } from "../middlewares/common.middleware";
import { UserValidator } from "../validator/user.validator";
import {PermissionEnum} from "../enums/permission.enum";
import {accountController} from "../controllers/account.controller";
import {userController} from "../controllers/user.controller";

const router = Router();




// Отримати свій профіль
router.get("/me", authMiddleware, userController.getMe);


// Оновити свій профіль
router.patch(
    "/update-me",
    authMiddleware,
    commonMiddleware.isBodyValid(UserValidator.update),
    userController.updateMe
);

// Видалити свій акаунт
router.delete(
    "/delete-me",
    authMiddleware,
    userController.deleteMe
);
router.patch(
    "/ban",
    authMiddleware,
    permissionMiddleware(PermissionEnum.BAN_USER),
    userController.banUser
);
router.post(
    "/create-manager",
    authMiddleware,
    permissionMiddleware(PermissionEnum.MANAGE_USERS),
    userController.createManager
);


router.patch(
    "/unban",
    authMiddleware,
    permissionMiddleware(PermissionEnum.UNBAN_USER),
    userController.unbanUser
);





export const userRouter = router;