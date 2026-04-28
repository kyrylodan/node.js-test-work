import { createHmac, timingSafeEqual } from "node:crypto";

import {ApiError} from "../errors/api.error";
import {configs} from "../configs/config";
import {userRepository} from "../repositories/user.repository";

interface IPremiumPaymentDto {
    paymentStatus: string;
    paymentReference: string;
    paymentSignature: string;
}

class AccountService {
    public async buyPremium(userId: string, dto: IPremiumPaymentDto) {
        const user = await userRepository.getById(userId);
        if (!user) throw new ApiError("User not found", 404);

        if (user.accountType === "premium") {
            throw new ApiError("User already has premium account", 400);
        }

        if (!configs.PREMIUM_PAYMENT_SECRET) {
            throw new ApiError("Payment integration is not configured", 503);
        }

        if (dto.paymentStatus !== "success") {
            throw new ApiError("Payment failed", 400);
        }

        const expectedSignature = createHmac("sha256", configs.PREMIUM_PAYMENT_SECRET)
            .update(`${userId}:${dto.paymentReference}:${dto.paymentStatus}`)
            .digest("hex");

        const incomingSignature = dto.paymentSignature.toLowerCase();
        const isValidSignature =
            incomingSignature.length === expectedSignature.length &&
            timingSafeEqual(
                Buffer.from(incomingSignature, "utf8"),
                Buffer.from(expectedSignature, "utf8"),
            );

        if (!isValidSignature) {
            throw new ApiError("Invalid payment signature", 403);
        }

        return userRepository.updateById(userId, {accountType: "premium"});
    }
}

export const accountService = new AccountService();
