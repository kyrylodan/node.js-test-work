import joi from "joi";

export class BrandRequestValidator {
    public static create = joi.object({
        name: joi.string().trim().min(2).max(50).required(),
    });
}
