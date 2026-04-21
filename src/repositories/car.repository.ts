import {ICar} from "../interfaces/car.interface";
import { ICarListQuery } from "../interfaces/car-list.interface";
import {Car} from "../models/car.model";
import { FilterQuery, Types } from "mongoose";

class CarRepository {
    public async create(dto: Partial<ICar>):Promise<ICar>{
        return Car.create(dto);
    }

    public async getById(carId:string):Promise<ICar | null>{
        return Car.findById(carId);
    }
    public async updateById(id: string, update: Partial<ICar>): Promise<ICar> {
        const updatedCar = await Car.findByIdAndUpdate(id, update, { new: true }).lean();
        if (!updatedCar) {
            throw new Error("Car not found");
        }

        return updatedCar;
    }
    public async countByUserId(userId: string): Promise<number> {
        return Car.countDocuments({ _userId: userId });
    }
    public async getAll(): Promise<ICar[]> {
        return Car.find().lean();
    }

    public async getAllWithFilters(query: ICarListQuery): Promise<{ data: ICar[]; total: number }> {
        const { page, limit, brandId, modelId, region, minPrice, maxPrice } = query;
        const filter: FilterQuery<ICar> = {};

        if (brandId) {
            filter.brand = brandId;
        }

        if (modelId) {
            filter.model = modelId;
        }

        if (region) {
            filter.region = { $regex: region, $options: "i" };
        }

        if (minPrice !== undefined || maxPrice !== undefined) {
            filter.originalPrice = {};

            if (minPrice !== undefined) {
                filter.originalPrice.$gte = minPrice;
            }

            if (maxPrice !== undefined) {
                filter.originalPrice.$lte = maxPrice;
            }
        }

        const skip = (page - 1) * limit;
        const [data, total] = await Promise.all([
            Car.find(filter).skip(skip).limit(limit).lean(),
            Car.countDocuments(filter),
        ]);

        return { data, total };
    }
    public async addView(carId: string): Promise<void> {
        await Car.findByIdAndUpdate(carId, {
            $inc: { views: 1 },
            $push: { viewHistory: { viewedAt: new Date() } }
        });
    }

    public async getAveragePrice(
        brand: string | Types.ObjectId,
        model: string | Types.ObjectId,
    ): Promise<number> {
        const result = await Car.aggregate([
            { $match: { brand, model } },
            { $group: { _id: null, avgPrice: { $avg: "$originalPrice" } } }
        ]);

        return result[0]?.avgPrice || 0;
    }
}

export const carRepository = new CarRepository();
