import express, { NextFunction, Request, Response } from "express";
import fileUpload from "express-fileupload";
import dotenv from "dotenv";
import mongoose from "mongoose";

import carRouter from "./src/routes/car.router";
import { accountRouter } from "./src/routes/account.router";
import authRouter from "./src/routes/auth.router";
import { brandRequestRouter } from "./src/routes/brand-request.router";
import {userRouter} from "./src/routes/user.router";
import { configs } from "./src/configs/config";
import {modelRequestRouter} from "./src/routes/model-request.router";



dotenv.config();

const app = express();

// ✅ Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// ✅ Routes (всі через /api)
app.use("/api/users", userRouter);
app.use("/api/cars", carRouter);
app.use("/api/auth", authRouter);
app.use("/api/account", accountRouter);
app.use("/api/brand-request", brandRequestRouter);
app.use("/api/model-request", modelRequestRouter);


// ✅ Health check
app.get("/", (req: Request, res: Response) => {
    res.send("API is working 🚀");
});

// ❌ 404 handler
app.use((req: Request, res: Response) => {
    res.status(404).json({ message: "Route not found" });
});

// ❌ Global error handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    console.error(err);

    const status = err.status || 500;
    const message = err.message || "Internal server error";

    res.status(status).json({ message });
});

// 🔌 MongoDB connect
if (!configs.MONGO_URI) {
    throw new Error("MONGO_URI is not defined in .env");
}

mongoose.connect(configs.MONGO_URI)
    .then(() => {
        console.log("MongoDB connected ✅");

        app.listen(configs.APP_PORT, () => {
            console.log(
                `Server running at http://${configs.APP_HOST}:${configs.APP_PORT}`
            );
        });
    })
    .catch((err) => {
        console.error("MongoDB connection error ❌:", err);
    });