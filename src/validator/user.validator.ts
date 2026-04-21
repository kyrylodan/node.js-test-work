import joi from "joi";
import {regexConstant} from "../constants/regex.constants";
import Joi from "joi";

export class UserValidator {
    private static name = joi.string().min(3).max(20).trim();
    private static age = joi.number().min(18).max(120);
    private static email = joi
        .string()
        .lowercase()
        .trim()
        .regex(regexConstant.EMAIL);
    private static password = joi.string().trim().regex(regexConstant.PASSWORD);
    private static phone = joi.string().trim().regex(regexConstant.PHONE);


    public static create = joi.object({
        name: this.name.required(),
        age: this.age.required(),
        email: this.email.required(),
        password: this.password.required(),
        phone: this.phone,
        role: Joi.string().valid("seller", "buyer").optional(),
        accountType: Joi.string().valid("basic").optional()
    });

    public static createManager = joi.object({
        name: this.name.required(),
        age: this.age.required(),
        email: this.email.required(),
        password: this.password.required(),
    });
    public static targetUserAction = joi.object({
        targetUserId: joi.string().required(),
    });

    public static update = joi.object({
        name: this.name,
        age: this.age,
        phone: this.phone,
    });

    public static signIn = joi.object({
        email: this.email.required(),
        password: this.password.required(),
    });
}
export const userValidator = new UserValidator();