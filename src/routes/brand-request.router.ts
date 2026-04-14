import {brandRequestController} from "../controllers/brand-request.controller";
import {Router} from "express";

const router = Router();


router.post(
    "/brand-request",
    brandRequestController.createBrandRequest.bind(brandRequestController)
);

export const brandRequestRouter = router;