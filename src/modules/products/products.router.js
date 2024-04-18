import { Router } from "express";
const router = Router();
import * as productsController from "./controller/products.controller.js";
import fileUpload, { fileValidation } from "../../services/multer.js";
import { auth } from "../../middleware/auth.js";
import { endPoint } from "./products.endpoint.js";
import { asyncHandler } from "../../middleware/errorHandling.js";
import * as validators from "./products.validation.js";
import { validation } from "../../middleware/validation.js";

router.get(
  "/",
  auth(endPoint.getAll),
  asyncHandler(productsController.getProucts)
);
router.post(
  "/",
  auth(endPoint.create),
  fileUpload(fileValidation.image).fields([
    { name: "mainImage", maxCount: 1 },
    { name: "subImages", maxCount: 5 },
  ]),
  validation(validators.createProduct),
  asyncHandler(productsController.createProduct)
);
router.get("/category/:categoryId", productsController.getProductWithCategory);
router.get("/:productId", productsController.getProduct);

export default router;
