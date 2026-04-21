import { ApiError } from "../errors/api.error";
import { IBrand } from "../interfaces/brand.interface";
import {brandRepository} from "../repositories/brand.repositories";


class BrandRequestService {
    public async create(dto: { name: string }): Promise<IBrand> {
        const existingBrandRequest = await brandRepository.findByName(dto.name);
        if (existingBrandRequest) {
            throw new ApiError("Brand request already exists", 409);
        }

        return await brandRepository.create({
            name: dto.name,
            models: [],
        });
    }

    public async getAll(): Promise<IBrand[]> {
        return await brandRepository.getAll();
    }
}

export const brandRequestService = new BrandRequestService();
