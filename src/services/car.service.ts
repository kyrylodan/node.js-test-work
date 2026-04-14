

import { UserMinInterface } from "../interfaces/user-min.interface";
import { IBrand } from "../interfaces/brand.interface";
import { IModel } from "../interfaces/model.interface";
import { ApiError } from "../errors/api.error";
import { brandRepository } from "../repositories/brand.repositories";
import { modelRepository } from "../repositories/model.repositories";
import { ICar } from "../interfaces/car.interface";
import { userRepository } from "../repositories/user.repository";
import { carRepository } from "../repositories/car.repository";
import { CarStatusEnum } from "../enums/car-status.enum";
import { BANNED_WORDS } from "../constants/baned-words.enum";
import { exchangeService } from "./exhange.service";
import { UploadedFile } from "express-fileupload";
import { s3Service } from "./s3.service";
import { FileItemTypeEnum } from "../enums/file-item-type.enum";
import { Car } from "../models/car.model";
import { carModerationService } from "./car-moderation.service";
import { PermissionEnum } from "../enums/permission.enum";
import { permissionService } from "./permission.service"; // <-- новий сервіс

class CarService {

    public async checkBrandAndModel(
        brandId: string,
        modelId: string,
        user: UserMinInterface
    ) {
        const brand = await brandRepository.getById(brandId);

        if (!brand) {
            throw new ApiError("Brand not found", 404);
        }

        const model = await modelRepository.getById(modelId);

        if (!model) {
            throw new ApiError("Model not found", 404);
        }

        return { brand, model };
    }

    public async updatePricesDaily() {
        const cars = await carRepository.getAll();
        const rates = await exchangeService.getRates();

        for (const car of cars) {
            const { originalPrice, originalCurrency } = car;

            let convertedPrices = { usd: 0, eur: 0, uah: 0 };

            switch (originalCurrency) {
                case "USD":
                    convertedPrices.usd = originalPrice;
                    convertedPrices.uah = originalPrice * rates.usd;
                    convertedPrices.eur = convertedPrices.uah / rates.eur;
                    break;
                case "UAH":
                    convertedPrices.uah = originalPrice;
                    convertedPrices.usd = originalPrice / rates.usd;
                    convertedPrices.eur = originalPrice / rates.eur;
                    break;
                case "EUR":
                    convertedPrices.eur = originalPrice;
                    convertedPrices.uah = originalPrice * rates.eur;
                    convertedPrices.usd = convertedPrices.uah / rates.usd;
                    break;
            }

            await carRepository.updateById(car.id, {
                convertedPrices,
                exchangeRateUsed: rates,
                ratesUpdatedAt: new Date()
            });
        }
    }

    public async create(dto: ICar, userId: string) {
        if (!userId || typeof userId !== "string") {
            throw new ApiError("Invalid userId", 400);
        }

        const user = await userRepository.getById(userId);
        if (!user) throw new ApiError("User not found", 404);

        permissionService.check(user.role, PermissionEnum.CREATE_CAR);

        const userCarsCount = await carRepository.countByUserId(userId);
        if (user.accountType === "basic" && userCarsCount >= 1) {
            throw new ApiError("Basic account can create only 1 car", 400);
        }

        const { brand, model } = await this.checkBrandAndModel(
            dto.brandId,
            dto.modelId,
            user
        );

        const rates = await exchangeService.getRates();
        const { originalPrice, originalCurrency } = dto;

        let convertedPrices = { usd: 0, eur: 0, uah: 0 };
        switch (originalCurrency) {
            case "USD":
                convertedPrices.usd = originalPrice;
                convertedPrices.uah = originalPrice * rates.usd;
                convertedPrices.eur = convertedPrices.uah / rates.eur;
                break;
            case "UAH":
                convertedPrices.uah = originalPrice;
                convertedPrices.usd = originalPrice / rates.usd;
                convertedPrices.eur = originalPrice / rates.eur;
                break;
            case "EUR":
                convertedPrices.eur = originalPrice;
                convertedPrices.uah = originalPrice * rates.eur;
                convertedPrices.usd = convertedPrices.uah / rates.usd;
                break;
        }

        const containsBanned = BANNED_WORDS.some(r => r.test(dto.description));
        const status: CarStatusEnum = containsBanned ? CarStatusEnum.PENDING : CarStatusEnum.ACTIVE;

        return carRepository.create({
            ...dto,
            brand: brand._id,
            model: model._id,
            originalPrice,
            originalCurrency,
            convertedPrices,
            exchangeRateUsed: rates,
            status,
            ratesUpdatedAt: new Date(),
            _userId: userId // завжди рядок ObjectId
        });
    }

    public async updateCar(carId: string, dto: Partial<ICar>, userId: string) {
        const user = await userRepository.getById(userId);
        if(!user) throw new ApiError("User not found", 404);

        permissionService.check(user.role, PermissionEnum.EDIT_CAR);

        const car = await carRepository.getById(carId);
        if (!car) throw new ApiError("Car not found", 404);
        if (car._userId.toString() !== userId) throw new ApiError("Forbidden", 403);
        if ((car.editCount || 0) >= 3) throw new ApiError("Max 3 edits reached", 400);

        let containsBanned = false;
        if (dto.description) {
            containsBanned = BANNED_WORDS.some(regex => regex.test(dto.description));
        }
        car.editCount = (car.editCount || 0) + 1;

        if (containsBanned) {
            await carModerationService.markAsFailed(car.id.toString());
            throw new ApiError(
                `Description contains inappropriate language. You have ${3 - car.failCount} attempts left.`,
                400
            );
        }

        return carRepository.updateById(carId, {
            ...dto,
            editCount: car.editCount,
            status: CarStatusEnum.ACTIVE,
        });
    }

    public async getStatistics(carId: string, userId: string) {
        const user = await userRepository.getById(userId);
        if(!user) throw new ApiError("User not found", 404);

        permissionService.check(user.role, PermissionEnum.VIEW_STATISTICS);

        if(user.accountType === "basic") {
            throw new ApiError("Basic account can't see statistics", 403);
        }

        const car = await carRepository.getById(carId);
        if(!car) throw new ApiError("Car not found", 404);

        const now = new Date();
        const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

        const totalViews = car.views;
        const viewsDay = car.viewHistory?.filter(v => v.viewedAt >= oneDayAgo).length || 0;
        const viewsWeek = car.viewHistory?.filter(v => v.viewedAt >= oneWeekAgo).length || 0;
        const viewsMonth = car.viewHistory?.filter(v => v.viewedAt >= oneMonthAgo).length || 0;


        const avgRegionalArr = await Car.aggregate([
            { $match: {
                    brand: car.brand,
                    model: car.model,
                    region: car.region
                } },
            { $group: { _id: "$region", avgPrice: { $avg: "$originalPrice" } } }
        ]);
        const avgRegional = avgRegionalArr[0]?.avgPrice || 0;
        const avgCountry = await carRepository.getAveragePrice(car.brand, car.model);


        return {
            views: totalViews,
            viewsDay,
            viewsWeek,
            viewsMonth,
            averagePriceRegion: avgRegional,
            averagePrice: avgCountry
        };
    }
    public async getCarById(carId: string) {
        const car = await carRepository.getById(carId);
        if (!car) throw new ApiError("Car not found", 404);

        await carRepository.addView(carId);

        return await carRepository.getById(carId);
    }


    public async uploadPhotos(carId: string, files: UploadedFile[], userId: string) {
        const car = await carRepository.getById(carId);
        if (!car) {
            throw new ApiError("Car not found", 404);
        }

        if (car._userId.toString() !== userId) {
            throw new ApiError("Forbidden", 403);
        }

        if (files.length + car.photos.length > 5) {
            throw new ApiError("Max 5 photos", 400);
        }

        const uploadedPhotos = await Promise.all(
            files.map(file => s3Service.uploadFile(file, FileItemTypeEnum.CAR, car.id))
        );

        return carRepository.updateById(car.id, {
            photos: [...car.photos, ...uploadedPhotos]
        });
    }

    public async deletePhoto(carId: string, photoUpl: string, userId: string) {
        const car = await carRepository.getById(carId);
        if (!car) {
            throw new ApiError("Car not found", 404);
        }

        if (car._userId.toString() !== userId) {
            throw new ApiError("Forbidden", 403);
        }

        await s3Service.deleteFile(photoUpl);

        const updatedPhotos = car.photos.filter(photo => photo !== photoUpl);

        return carRepository.updateById(car.id, { photos: updatedPhotos });
    }
}

export const carService = new CarService();