import { NextFunction, Request, Response } from "express";
import {modelRequestService} from "../services/model.service";


class ModelRequestController {
    async createModelRequest(req: Request, res: Response, next: NextFunction) {
        try {
            const { userName, brandName, modelName } = req.body;

            if (!userName || !brandName || !modelName) {
                return res.status(400).json({
                    message: "userName, brandName and modelName are required"
                });
            }

            const result = await modelRequestService.modelRequest(
                userName,
                brandName,
                modelName
            );

            return res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    }
}

export const modelRequestController = new ModelRequestController();
