import { Router} from "express";
import { carController } from "../controllers/car.controller";
import fileUpload from "express-fileupload";

import {authMiddleware} from "../middlewares/auth.middleware";
import {checkCarOwnerMiddleware} from "../middlewares/check-car-owner.middleware";


const router = Router();



// Створити авто
router.post("/", authMiddleware, carController.create);

// Статистика авто
router.get(
    "/:carId/statistics",
    authMiddleware,
    carController.getStatistics
);

// Перевірка бренду + моделі
router.post("/check-brand-model", carController.checkBrandModel);

// Оновити авто
router.patch("/:carId", authMiddleware, checkCarOwnerMiddleware, carController.updateCar);


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