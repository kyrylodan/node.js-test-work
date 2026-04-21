import { Request, Response, NextFunction } from "express";
import { UploadedFile } from "express-fileupload";
import {carService} from "../services/car.service";
import { ICarListQuery } from "../interfaces/car-list.interface";
import { ICar } from "../interfaces/car.interface";
import { IPaginatedResponse } from "../interfaces/pagination.interface";

class CarController {
    public async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const query: ICarListQuery = {
                page: Number(req.query.page) || 1,
                limit: Number(req.query.limit) || 10,
            };

            if (typeof req.query.brandId === "string") {
                query.brandId = req.query.brandId;
            }

            if (typeof req.query.modelId === "string") {
                query.modelId = req.query.modelId;
            }

            if (typeof req.query.region === "string") {
                query.region = req.query.region;
            }

            if (req.query.minPrice) {
                query.minPrice = Number(req.query.minPrice);
            }

            if (req.query.maxPrice) {
                query.maxPrice = Number(req.query.maxPrice);
            }

            const result: IPaginatedResponse<ICar> = await carService.getAllWithFilters(query);
            res.status(200).json(result);
        } catch (e) {
            next(e);
        }
    }

    public async create(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {

            const userId = res.locals.userId;

            const car = await carService.create(req.body, userId);


            res.status(201).json(car);
        } catch (e) {
            next(e);
        }
    }

    public async getStatistics(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId = res.locals.userId;
            const carId = req.params.carId;
            if (!carId) {
                throw new Error("Car ID is required");
            }

            const stats = await carService.getStatistics(carId, userId);
            res.status(200).json(stats);
        } catch (e) {
            next(e);
        }
    }

    public async checkBrandModel(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { brand, model } = req.body;
            await carService.checkBrandAndModel(brand, model);
            res.status(200).json({ message: "ok" });
        } catch (e) {
            next(e);
        }
    }
    public async updateCar(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const car = res.locals.car;                 // авто з middleware
            const userId = res.locals.userId;          // рядок ObjectId
            const updatedCar = await carService.updateCar(car.id, req.body, userId);
            res.status(200).json(updatedCar);
        } catch (e) {
            next(e);
        }
    }
    public async updatePricesDaily(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {

            await carService.updatePricesDaily();

            res.status(200).json({
                message: "Prices updated successfully"
            });
        } catch (e) {
            next(e);
        }
    }

    public async uploadPhotos(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {


            const userId = res.locals.userId;
            const carId = req.params.carId;
            if (!carId) {
                throw new Error("Car ID is required");
            }

            if (!req.files) {
                res.status(400).json({ message: "No files uploaded" });
                return;
            }

            const uploaded = req.files.photos;

            if (!uploaded) {
                res.status(400).json({ message: "Field 'photos' is required" });
                return;
            }

            const files: UploadedFile[] = Array.isArray(uploaded) ? uploaded : [uploaded];

            const updatedCar = await carService.uploadPhotos(carId, files, userId);
            res.status(200).json(updatedCar);
        } catch (e) {
            next(e);
        }
    }


    public async deletePhoto(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId = res.locals.userId;
            const carId = req.params.carId;
            const photoUrl = req.body.photoUrl;
            if (!carId) {
                throw new Error("Car ID is required");
            }

            const updatedCar = await carService.deletePhoto(carId, photoUrl, userId);
            res.status(200).json(updatedCar);
        } catch (e) {
            next(e);
        }
    }
    public async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const carId = req.params.carId;
            if (!carId) {
                throw new Error("Car ID is required");
            }

            const car = await carService.getCarById(carId);
            res.status(200).json(car);
        } catch (e) {
            next(e);
        }
    }

}


export const carController = new CarController();
