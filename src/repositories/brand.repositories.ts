import { IBrand } from "../interfaces/brand.interface";
import { Brand } from "../models/brand.model";

class BrandRepository {

    public async getByName(name: string): Promise<IBrand | null> {
        return Brand.findOne({ name });
    }

    public async getById(id: string): Promise<IBrand | null> {
        return Brand.findById(id);
    }

    public async create(data: Partial<IBrand>): Promise<IBrand> {
        return Brand.create(data);
    }

    public async findByParams(params: Partial<IBrand>): Promise<IBrand | null> {
        return Brand.findOne(params);
    }

    public async getAll(): Promise<IBrand[]> {
        return Brand.find();
    }
}

export const brandRepository = new BrandRepository();