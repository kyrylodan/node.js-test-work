import { IModel } from "../interfaces/model.interface";
import { ModelModel } from "../models/models.model";

class ModelRepository {

    public async getByNameAndBrand(name: string, brandId: string): Promise<IModel | null> {
        return ModelModel.findOne({ name, brandId });
    }

    public async getById(id: string): Promise<IModel | null> {
        return ModelModel.findById(id);
    }

    public async create(data: Partial<IModel>): Promise<IModel> {
        return ModelModel.create(data);
    }

    public async findByParams(params: Partial<IModel>): Promise<IModel | null> {
        return ModelModel.findOne(params);
    }

    public async findAllByParams(params: Partial<IModel>): Promise<IModel[]> {
        return ModelModel.find(params);
    }
}

export const modelRepository = new ModelRepository();