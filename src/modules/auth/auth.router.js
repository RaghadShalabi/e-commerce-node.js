import { Router } from "express";
const router = Router();
import * as authController from "./controller/auth.controller.js";
import fileUpload, { fileValidation } from "../../services/multer.js";
import { asyncHandler } from "../../middleware/errorHandling.js";

router.post(
  "/signUp",
  fileUpload(fileValidation.image).single("image"),
  asyncHandler(authController.signUp)
);
router.post("/signIn", asyncHandler(authController.signIn));
router.get("/confirmEmail/:token", asyncHandler(authController.confirmEmail));
router.patch("/sendCode", asyncHandler(authController.sendCode));
router.post("/forgetPassword", asyncHandler(authController.forgetPassword));
router.delete(
  "/invalidConfirm",
  asyncHandler(authController.deleteInvalidConfirm)
);

export default router;
