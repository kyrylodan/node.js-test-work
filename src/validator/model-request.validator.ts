import joi from "joi";

export class ModelRequestValidator {
    public static create = joi.object({
        name: joi.string().trim().min(1).max(50).required(),
        brandId: joi.string().trim().required(),
    });
}
