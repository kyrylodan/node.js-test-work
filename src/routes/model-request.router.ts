import { Router } from "express";
import {modelRequestController} from "../controllers/model-request.controller";
import {commonMiddleware} from "../middlewares/common.middleware";
import {authMiddleware} from "../middlewares/auth.middleware";
import {ModelRequestValidator} from "../validator/model-request.validator";


const router = Router();
router.get("/", modelRequestController.getAll);

router.post(
    "/",
    authMiddleware,
    commonMiddleware.isBodyValid(ModelRequestValidator.create),
    modelRequestController.create
);


export const modelRouter = router;
export const modelRequestRouter = router;
