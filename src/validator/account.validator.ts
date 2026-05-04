import joi from "joi";

export class AccountValidator {
    public static buyPremium = joi.object({
        paymentStatus: joi.string().valid("success").required(),
        paymentReference: joi.string().trim().min(3).max(255).required(),
        paymentSignature: joi.string().trim().length(64).hex().required(),
    });
}
