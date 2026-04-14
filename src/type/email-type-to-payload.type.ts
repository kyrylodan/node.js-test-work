import {EmailPayloadCombined} from "./email-payload-combined.type";
import {PickRequired} from "./pick-required.type";
import {EmailTypeEnum} from "../enums/email-type.enum";

export type EmailTypeToPayload = {
    [EmailTypeEnum.WELLCOME]: PickRequired<EmailPayloadCombined, "name">;

    [EmailTypeEnum.FORGOT_PASSWORD]: PickRequired<EmailPayloadCombined, "name" | "email">;

    [EmailTypeEnum.OLD_VISITOR]: PickRequired<EmailPayloadCombined, "name">;

    [EmailTypeEnum.BRAND_REQUEST]: {
        name: string;
        brand: string;
    };

    [EmailTypeEnum.CAR_REVIEW]: {
        name: string;
        carTitle: string;
    };
};