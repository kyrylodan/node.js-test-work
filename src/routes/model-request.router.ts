import { Router } from "express";

import {modelRequestController} from "../controllers/model-request.controller";
import {authMiddleware} from "../middlewares/auth.middleware";
import {commonMiddleware} from "../middlewares/common.middleware";
import {ModelRequestValidator} from "../validator/model-request.validator";

const modelRouter = Router();
const modelRequestRouter = Router();

modelRouter.get("/", modelRequestController.getAll);

modelRequestRouter.post(
    "/",
    authMiddleware,
    commonMiddleware.isBodyValid(ModelRequestValidator.create),
    modelRequestController.create
);

export { modelRouter, modelRequestRouter };
