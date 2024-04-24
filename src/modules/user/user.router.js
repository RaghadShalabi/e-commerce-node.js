import { Router } from "express";
const router = Router();
import * as userController from "./controller/user.controller.js";
import { auth, roles } from "../../middleware/auth.js";
import { asyncHandler } from "../../middleware/errorHandling.js";
import { endPoint } from "./user.endpoint.js";
import fileUpload, { fileValidation } from "../../services/multer.js";

router.get(
  "/profile",
  auth(Object.values(roles)),
  asyncHandler(userController.getProfile)
);
router.post(
  "/uploadUserExcel",
  auth(endPoint.uploadUerExcel),
  fileUpload(fileValidation.excel).single("excel"),
  asyncHandler(userController.uploadUserExcel)
);
router.get("/users", asyncHandler(userController.getUsers));
export default router;
