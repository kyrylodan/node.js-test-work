
import {ApiError} from "../errors/api.error";
import {userRepository} from "../repositories/user.repository";


class AccountService {
    public async buyPremium(userId: string, paymentStatus: string) {
        const user = await userRepository.getById(userId);
        if (!user) throw new ApiError("User not found", 404);

        if (user.accountType === "premium") {
            throw new ApiError("User already has premium account", 400);
        }

        if (paymentStatus !== "success") {
            throw new ApiError("Payment failed", 400);
        }

        return userRepository.updateById(userId, {accountType: "premium"});
    }
}
export const accountService = new AccountService();