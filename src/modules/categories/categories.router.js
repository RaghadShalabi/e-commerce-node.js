import { Router } from "express";
const router = Router();
import * as categoriesController from "./controller/categories.controller.js";
import fileUpload, { fileValidation } from "../../services/multer.js";
import subcategoriesRouter from "../subcategories/subcategories.router.js";
import { auth, roles } from "../../middleware/auth.js";
import { endPoint } from "./categories.endpoint.js";
import { asyncHandler } from "../../middleware/errorHandling.js";
import { validation } from "../../middleware/validation.js";
import * as validators from "./categories.validation.js";

router.use("/:id/subcategories", subcategoriesRouter);
router.get("/", auth(endPoint.getAll), asyncHandler(categoriesController.getCategories));
router.get("/active", asyncHandler(categoriesController.getActiveCategory));
router.get("/:id", validation(validators.getSpecificCategory), asyncHandler(categoriesController.getSpecificCategory));
router.post("/", auth(endPoint.create), fileUpload(fileValidation.image).single("image"), validation(validators.createCategory), asyncHandler(categoriesController.createCategory));
router.put("/:id", auth(endPoint.update), fileUpload(fileValidation.image).single("image"), asyncHandler(categoriesController.updateCategory));
router.delete("/:categoryId", auth(endPoint.delete), asyncHandler(categoriesController.deleteCategory));

export default router;
