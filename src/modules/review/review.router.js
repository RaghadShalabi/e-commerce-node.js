import { Router } from "express";
import { asyncHandler } from "../../middleware/errorHandling.js";
import * as reviewController from "./controller/review.controller.js";
import { auth } from "../../middleware/auth.js";
import { endPoint } from "./review.endpoint.js";
const router = Router({ mergeParams: true });

router.post("/", auth(endPoint.create), asyncHandler(reviewController.create));

export default router;
