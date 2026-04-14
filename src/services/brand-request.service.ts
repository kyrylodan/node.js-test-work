import {EmailTypeEnum} from "../enums/email-type.enum";
import {emailService} from "./email.service";
import {configs} from "../configs/config";

class BrandRequestService {
    async brandRequest(userName: string, brandName: string) {

        await emailService.sendMail(
            configs.ADMIN_EMAIL,
            EmailTypeEnum.BRAND_REQUEST,
            {
                name: userName,
                brand: brandName
            }
        );

        return {
            message: "Brand request sent to admin"
        };
    }

}

export const brandRequestService = new BrandRequestService();