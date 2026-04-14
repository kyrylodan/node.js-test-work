import {NextFunction, Request, Response} from "express";
import {brandRequestService} from "../services/brand-request.service";

class BrandRequestController {
    async createBrandRequest(req: Request, res: Response, next: NextFunction) {
        try {
            const { userName, brandName } = req.body;

            if (!userName || !brandName) {
                return res.status(400).json({ message: "userName and brandName are required" });
            }

            const result = await brandRequestService.brandRequest(userName, brandName);

            return res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    }
}

export const brandRequestController = new BrandRequestController();