import { model, Schema } from "mongoose";

import { IRole } from "../interfaces/role.interface";

const roleSchema = new Schema<IRole>(
    {
        name: { type: String, required: true, unique: true, trim: true },
        permissions: { type: [String], default: [] },
        description: { type: String, default: null },
        isActive: { type: Boolean, default: true },
    },
    {
        timestamps: true,
        versionKey: false,
    },
);

export const Role = model<IRole>("roles", roleSchema);
