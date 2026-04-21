import express, { NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";

import carRouter from "./src/routes/car.router";
import { accountRouter } from "./src/routes/account.router";
import authRouter from "./src/routes/auth.router";
import { brandRequestRouter, brandRouter } from "./src/routes/brand-request.router";
import { userRouter } from "./src/routes/user.router";
import { configs } from "./src/configs/config";
import { modelRequestRouter, modelRouter } from "./src/routes/model-request.router";
import { tokenRepository } from "./src/repositories/token.repositories";
import { roleService } from "./src/services/role.service";

dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/users", userRouter);
app.use("/api/cars", carRouter);
app.use("/api/auth", authRouter);
app.use("/api/account", accountRouter);
app.use("/api/brands", brandRouter);
app.use("/api/models", modelRouter);
app.use("/api/brand-request", brandRequestRouter);
app.use("/api/model-request", modelRequestRouter);

app.get("/", (req: Request, res: Response) => {
    res.send("API is working");
});

app.use((req: Request, res: Response) => {
    res.status(404).json({ message: "Route not found" });
});

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    console.error(err);

    const status = err.status || 500;
    const message = err.message || "Internal server error";

    res.status(status).json({ message });
});

if (!configs.MONGO_URI) {
    throw new Error("MONGO_URI is not defined in .env");
}

mongoose.connect(configs.MONGO_URI)
    .then(async () => {
        console.log("MongoDB connected");
        await roleService.seedDefaultRoles();
        const migratedUsersCount = await roleService.migrateLegacyUserRoles();
        if (migratedUsersCount > 0) {
            console.log(`Migrated ${migratedUsersCount} users to database roles`);
        }

        const deletedTokensCount = await tokenRepository.deleteExpiredTokens();
        if (deletedTokensCount > 0) {
            console.log(`Deleted ${deletedTokensCount} expired tokens on startup`);
        }

        app.listen(configs.APP_PORT, () => {
            console.log(
                `Server running at http://${configs.APP_HOST}:${configs.APP_PORT}`
            );
        });
    })
    .catch((err) => {
        console.error("MongoDB connection error:", err);
    });
