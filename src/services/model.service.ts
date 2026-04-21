import { ApiError } from "../errors/api.error";
import { IModel } from "../interfaces/model.interface";
import { brandRepository } from "../repositories/brand.repositories";
import { modelRepository } from "../repositories/model.repositories";

class ModelRequestService {
    public async create(dto: { name: string; brandId: string }): Promise<IModel> {
        const brand = await brandRepository.getById(dto.brandId);
        if (!brand) {
            throw new ApiError("Brand not found", 404);
        }

        const existingModel = await modelRepository.findByNameAndBrandId(dto.name, dto.brandId);
        if (existingModel) {
            throw new ApiError("Model request already exists", 409);
        }

        return await modelRepository.create({
            name: dto.name,
            brandId: dto.brandId,
        });
    }

    public async getAll(brandId?: string): Promise<IModel[]> {
        return await modelRepository.getAll(brandId);
    }
}

export const modelRequestService = new ModelRequestService();
