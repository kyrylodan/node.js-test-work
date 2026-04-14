import {EmailTypeEnum} from "../enums/email-type.enum";

type EmailConstantType = {
    subject: string;
    text?: string;
    template?: string;
};

export const emailConstants: Record<EmailTypeEnum, EmailConstantType> = {
    [EmailTypeEnum.WELLCOME]: {
        subject: "Welcome to our app",
        text: "Welcome to our app"
    },
    [EmailTypeEnum.FORGOT_PASSWORD]: {
        subject: "Forgot password",
        template: "forgot-password"
    },
    [EmailTypeEnum.OLD_VISITOR]: {
        subject: "Old visitor",
        template: "old-visit"
    },
    [EmailTypeEnum.BRAND_REQUEST]: {
        subject: "Brand request",
        template: "brand-request"
    },
    [EmailTypeEnum.CAR_REVIEW]: {
        subject: "Car review",
        template: "car-review"
    }
};