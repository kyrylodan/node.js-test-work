import { IRole } from "../interfaces/role.interface";
import { Role } from "../models/role.model";

class RoleRepository {
    public async getByName(name: string): Promise<IRole | null> {
        return await Role.findOne({ name });
    }

    public async upsertByName(dto: Partial<IRole> & Pick<IRole, "name">): Promise<IRole> {
        return await Role.findOneAndUpdate(
            { name: dto.name },
            dto,
            {
                new: true,
                upsert: true,
                setDefaultsOnInsert: true,
            },
        );
    }
}

export const roleRepository = new RoleRepository();
