import joi from "joi";

export class CarValidator {
    public static create = joi.object({
        brandId: joi.string().trim().required(),
        modelId: joi.string().trim().required(),
        title: joi.string().trim().min(3).max(100).required(),
        description: joi.string().trim().allow("").max(5000).optional(),
        region: joi.string().trim().allow("").max(100).optional(),
        originalPrice: joi.number().positive().required(),
        originalCurrency: joi.string().valid("USD", "EUR", "UAH").required(),
    });

    public static update = joi.object({
        title: joi.string().trim().min(3).max(100).optional(),
        description: joi.string().trim().allow("").max(5000).optional(),
        region: joi.string().trim().allow("").max(100).optional(),
        originalPrice: joi.number().positive().optional(),
        originalCurrency: joi.string().valid("USD", "EUR", "UAH").optional(),
    }).min(1);
}
