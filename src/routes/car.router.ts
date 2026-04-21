import { Router} from "express";
import { carController } from "../controllers/car.controller";
import fileUpload from "express-fileupload";

import {authMiddleware} from "../middlewares/auth.middleware";
import {permissionMiddleware} from "../middlewares/permission.middleware";
import {PermissionEnum} from "../enums/permission.enum";
import {commonMiddleware} from "../middlewares/common.middleware";
import {CarValidator} from "../validator/car.validator";


const router = Router();

router.get("/", carController.getAll);

router.post(
    "/",
    authMiddleware,
    permissionMiddleware(PermissionEnum.CREATE_CAR),
    commonMiddleware.isBodyValid(CarValidator.create),
    carController.create
);

router.patch(
    "/:carId",
    authMiddleware,
    permissionMiddleware(PermissionEnum.EDIT_CAR),
    commonMiddleware.isBodyValid(CarValidator.update),
    carController.updateCar
);

router.get(
    "/:carId/statistics",
    authMiddleware,
    permissionMiddleware(PermissionEnum.VIEW_STATISTICS),
    carController.getStatistics
);

router.post("/check-brand-model", carController.checkBrandModel);

// Завантаження фото (макс 5)
router.post(
    "/:carId/photos",
    authMiddleware,
    fileUpload({
        createParentPath: true,
        limits: { fileSize: 10 * 1024 * 1024 },
        abortOnLimit: true,
    }),
    (req, res, next) => {
        next();
    },
    carController.uploadPhotos
);

router.get("/:carId", carController.getById);


// Видалення фото
router.delete("/:carId/photos",authMiddleware, carController.deletePhoto);

router.post("/update-prices-daily", authMiddleware, carController.updatePricesDaily);
export default router;
