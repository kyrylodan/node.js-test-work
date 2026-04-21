import {brandRequestController} from "../controllers/brand-request.controller";
import {Router} from "express";
import {authMiddleware} from "../middlewares/auth.middleware";
import {commonMiddleware} from "../middlewares/common.middleware";
import {BrandRequestValidator} from "../validator/brand-request.validator";

const router = Router();

router.get("/", brandRequestController.getAll);

router.post(
    "/",
    authMiddleware,
    commonMiddleware.isBodyValid(BrandRequestValidator.create),
    brandRequestController.create
);

export const brandRouter = router;
export const brandRequestRouter = router;
