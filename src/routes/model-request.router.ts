import { Router } from "express";
import {modelRequestController} from "../controllers/model-request.controller";


const router = Router();

router.post(
    "/model-request",
    modelRequestController.createModelRequest.bind(modelRequestController)
);

export const modelRequestRouter = router;
