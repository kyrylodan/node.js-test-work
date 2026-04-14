import { EmailTypeEnum } from "../enums/email-type.enum";
import { emailService } from "./email.service";
import { configs } from "../configs/config";

class ModelRequestService {
    async modelRequest(userName: string, brandName: string, modelName: string) {
        await emailService.sendMail(
            configs.ADMIN_EMAIL,
            EmailTypeEnum.BRAND_REQUEST,
            {
                name: userName,
                brand: `${brandName} / ${modelName}`
            }
        );

        return {
            message: "Model request sent to admin"
        };
    }
}

export const modelRequestService = new ModelRequestService();
