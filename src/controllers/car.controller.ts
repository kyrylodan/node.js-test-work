import { Request, Response, NextFunction } from "express";
import { UploadedFile } from "express-fileupload";
import {carService} from "../services/car.service";
import {userService} from "../services/user.service";

class CarController {
    public async create(req: Request, res: Response, next: NextFunction) {
        try {

            const userId = res.locals.userId;

            const car = await carService.create(req.body, userId);


            res.status(201).json(car);
        } catch (e) {
            next(e);
        }
    }

    public async getStatistics(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = res.locals.userId;
            const stats = await carService.getStatistics(req.params.carId, userId);
            res.status(200).json(stats);
        } catch (e) {
            next(e);
        }
    }

    public async checkBrandModel(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = res.locals.userId;
            const { brand, model } = req.body;
            await carService.checkBrandAndModel(brand, model, { _id: userId, name: res.locals.name });
            res.status(200).json({ message: "ok" });
        } catch (e) {
            next(e);
        }
    }
    public async updateCar(req: Request, res: Response, next: NextFunction) {
        try {
            const car = res.locals.car;                 // авто з middleware
            const userId = res.locals.userId;          // рядок ObjectId
            const updatedCar = await carService.updateCar(car.id, req.body, userId);
            res.status(200).json(updatedCar);
        } catch (e) {
            next(e);
        }
    }
    public async updatePricesDaily(req: Request, res: Response, next: NextFunction) {
        try {

            await carService.updatePricesDaily();

            res.status(200).json({
                message: "Prices updated successfully"
            });
        } catch (e) {
            next(e);
        }
    }

    public async uploadPhotos(req: Request, res: Response, next: NextFunction) {
        try {


            const userId = res.locals.userId;
            const carId = req.params.carId;

            if (!req.files) {
                return res.status(400).json({ message: "No files uploaded" });
            }

            const uploaded = req.files.photos;

            if (!uploaded) {
                return res.status(400).json({ message: "Field 'photos' is required" });
            }

            const files: UploadedFile[] = Array.isArray(uploaded) ? uploaded : [uploaded];

            const updatedCar = await carService.uploadPhotos(carId, files, userId);
            res.status(200).json(updatedCar);
        } catch (e) {
            next(e);
        }
    }


    public async deletePhoto(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = res.locals.userId;
            const carId = req.params.carId;
            const photoUrl = req.body.photoUrl;
            const updatedCar = await carService.deletePhoto(carId, photoUrl, userId);
            res.status(200).json(updatedCar);
        } catch (e) {
            next(e);
        }
    }
    public async getById(req: Request, res: Response, next: NextFunction) {
        try {
            const car = await carService.getCarById(req.params.carId);
            res.status(200).json(car);
        } catch (e) {
            next(e);
        }
    }

}


export const carController = new CarController();