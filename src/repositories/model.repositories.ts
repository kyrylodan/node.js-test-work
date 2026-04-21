import { IModel } from "../interfaces/model.interface";
import { ModelModel } from "../models/models.model";

class ModelRepository {
    public async create(dto: Partial<IModel>): Promise<IModel> {
        return await ModelModel.create(dto);
    }

    public async findByNameAndBrandId(name: string, brandId: string): Promise<IModel | null> {
        return await ModelModel.findOne({ name, brandId });
    }

    public async getById(id: string): Promise<IModel | null> {
        return await ModelModel.findById(id);
    }

    public async getAll(brandId?: string): Promise<IModel[]> {
        const filter = brandId ? { brandId } : {};

        return await ModelModel.find(filter).sort({ name: 1 });
    }
}

export const modelRepository = new ModelRepository();
