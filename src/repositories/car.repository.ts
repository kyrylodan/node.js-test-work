import {ICar} from "../interfaces/car.interface";
import {Car} from "../models/car.model";

class CarRepository {
    public async create(dto: Partial<ICar>):Promise<ICar>{
        return Car.create(dto);
    }

    public async getById(carId:string):Promise<ICar | null>{
        return Car.findById(carId);
    }
    public async updateById(id: string, update: Partial<ICar>): Promise<ICar> {
        return await Car.findByIdAndUpdate(id, update, { new: true }).lean();
    }
    public async countByUserId(userId: string): Promise<number> {
        return Car.countDocuments({ _userId: userId });
    }
    public async getAll(): Promise<ICar[]> {
        return Car.find().lean();
    }
    public async addView(carId: string): Promise<void> {
        await Car.findByIdAndUpdate(carId, {
            $inc: { views: 1 },
            $push: { viewHistory: { viewedAt: new Date() } }
        });
    }

    public async getAveragePrice(brand: string, model: string): Promise<number> {
        const result = await Car.aggregate([
            { $match: { brand, model } },
            { $group: { _id: null, avgPrice: { $avg: "$price" } } }
        ]);

        return result[0]?.avgPrice || 0;
    }
}

export const carRepository = new CarRepository();