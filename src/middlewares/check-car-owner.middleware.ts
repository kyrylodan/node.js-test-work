import { ApiError } from "../errors/api.error";
import { NextFunction, Request, Response } from "express";
import { carRepository } from "../repositories/car.repository";
import { Types } from "mongoose";

export const checkCarOwnerMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const carId = req.params.carId;
        const userId = res.locals.userId;

        if (!carId || !Types.ObjectId.isValid(carId)) throw new ApiError("Invalid car ID", 400);
        if (!userId || !Types.ObjectId.isValid(userId)) throw new ApiError("Invalid user ID", 401);

        const car = await carRepository.getById(carId);
        if (!car) throw new ApiError("Car not found", 404);

        if (car._userId.toString() !== userId) throw new ApiError("Forbidden", 403);

        res.locals.car = car;

        next();
    } catch (e) {
        next(e);
    }
};