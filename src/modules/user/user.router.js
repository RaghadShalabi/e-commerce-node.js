import { Router } from "express";
const router = Router();
import * as userController from "./controller/user.controller.js";
import { auth, roles } from "../../middleware/auth.js";
import { asyncHandler } from "../../middleware/errorHandling.js";

router.get('/profile', auth(Object.values(roles)), asyncHandler(userController.getProfile));

export default router;