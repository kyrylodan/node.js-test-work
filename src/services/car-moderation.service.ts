import { Car } from "../models/car.model";
import { emailService } from "./email.service";
import {CarStatusEnum} from "../enums/car-status.enum";

class CarModerationService {

    public async markAsFailed(carId: string) {
        const car = await Car.findById(carId);

        if (!car) {
            throw new Error("Car not found");
        }

        car.failCount += 1;

        if (car.failCount >= 3) {
            car.status = CarStatusEnum.INACTIVE;

            await emailService.sendManagerNotification(car._id.toString());
        }

        await car.save();

        return car;
    }
}

export const carModerationService = new CarModerationService();
