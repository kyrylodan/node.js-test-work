import {NextFunction, Request, Response} from "express";
import { IBrand } from "../interfaces/brand.interface";
import {brandRequestService} from "../services/brand-request.service";

class BrandRequestController {
    public async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const result: IBrand[] = await brandRequestService.getAll();
            res.status(200).json(result);
        } catch (e) {
            next(e);
        }
    }

    public async create(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const dto = req.body;

            const result = await brandRequestService.create(dto);

            res.status(201).json(result);
        } catch (e) {
            next(e);
        }
    }
}


export const brandRequestController = new BrandRequestController();
