import {model, Schema} from "mongoose";
import {CarStatusEnum} from "../enums/car-status.enum";
import {ICar} from "../interfaces/car.interface";

const carSchema = new Schema(
    {
        brand: { type: Schema.Types.ObjectId, ref: "Brand", required: true },
        model: { type: Schema.Types.ObjectId, ref: "Model", required: true },

        originalPrice: { type: Number, required: true, price: { type: Number, required: true} },
        originalCurrency: { type: String, enum: ["USD", "EUR", "UAH"], required: true },

        convertedPrices: {
            usd: Number,
            eur: Number,
            uah: Number,
        },
        title: { type: String, required: true },

        status: {
            type: String,
            enum: Object.values(CarStatusEnum),
            default: CarStatusEnum.PENDING
        },

        failCount: {
            type: Number,
            default: 0
        },

        exchangeRateUsed: {
            usd: Number,
            eur: Number,
            uah: Number,
            updatedAt: Date
        },



        views: { type: Number, default: 0 },

        viewHistory: [
            {
                viewedAt: { type: Date, default: Date.now }
            }
        ],


        _userId: { type: Schema.Types.ObjectId, ref: "User", required: true },

        description: { type: String, default: "" },
        photos: [{ type: String }],
        region: { type: String, default: "" },
        editCount: { type: Number, default: 0 }

    },
    { timestamps: true }
);

export const Car = model<ICar>("cars", carSchema);
