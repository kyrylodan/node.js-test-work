import { IBrand } from "../interfaces/brand.interface";
import { Brand } from "../models/brand.model";

class BrandRepository {
    public async create(dto: Partial<IBrand>): Promise<IBrand> {
        return await Brand.create(dto);
    }

    public async findByName(name: string): Promise<IBrand | null> {
        return await Brand.findOne({ name });
    }

    public async getById(id: string): Promise<IBrand | null> {
        return await Brand.findById(id);
    }

    public async getAll(): Promise<IBrand[]> {
        return await Brand.find().sort({ name: 1 });
    }
}

export const brandRepository = new BrandRepository();
