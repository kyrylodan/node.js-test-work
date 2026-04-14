import {ObjectSchema} from "joi";
import {NextFunction, Request, Response} from "express";
import {ApiError} from "../errors/api.error";

class CommonMiddleware {

    public isBodyValid(validator:ObjectSchema) {
        return async (req: Request, res: Response, next: NextFunction) => {
            try {
                req.body = await validator.validateAsync(req.body);
                next();
            } catch (e: any) {
                next(new ApiError(e.details[0].message, 400));
            }
        }


    }


}
export const commonMiddleware = new CommonMiddleware();