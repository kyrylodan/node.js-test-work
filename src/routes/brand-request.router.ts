import {Router} from "express";

import {brandRequestController} from "../controllers/brand-request.controller";
import {authMiddleware} from "../middlewares/auth.middleware";
import {commonMiddleware} from "../middlewares/common.middleware";
import {BrandRequestValidator} from "../validator/brand-request.validator";

const brandRouter = Router();
const brandRequestRouter = Router();

brandRouter.get("/", brandRequestController.getAll);

brandRequestRouter.post(
    "/",
    authMiddleware,
    commonMiddleware.isBodyValid(BrandRequestValidator.create),
    brandRequestController.create
);

export { brandRouter, brandRequestRouter };
