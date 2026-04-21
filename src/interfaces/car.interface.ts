import { CarStatusEnum } from "../enums/car-status.enum";
import { Types } from "mongoose";

export interface ICar {
    id: string;
    _userId: string;
    brandId:string;
    modelId:string;
    brand: string | Types.ObjectId;
    model: string | Types.ObjectId;

    convertedPrices: {
        usd: number;
        eur: number;
        uah: number;
    }
    exchangeRateUsed: {
        usd?: number;
        eur?: number;
        uah?: number;

    }
    ratesUpdatedAt: Date;
    viewHistory?: {
        viewedAt: Date;
    }[];


    price:number;
    region:string;
    views: number;
    createAt?: Date;
    description?: string;
    photos: string[];
    editCount?: number;
    title: string;
    status: CarStatusEnum;
    failCount: number;
    originalPrice: number;
    originalCurrency: string;

}
