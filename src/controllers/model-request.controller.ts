import { NextFunction, Request, Response } from "express";
import { IModel } from "../interfaces/model.interface";
import {modelRequestService} from "../services/model.service";


class ModelRequestController {
    public async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const brandId = req.query.brandId as string | undefined;
            const result: IModel[] = await modelRequestService.getAll(brandId);
            res.status(200).json(result);
        } catch (e) {
            next(e);
        }
    }

    public async create(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const dto = req.body;

            const result = await modelRequestService.create(dto);

            res.status(201).json(result);
        } catch (e) {
            next(e);
        }
    }
}

export const modelRequestController = new ModelRequestController();
