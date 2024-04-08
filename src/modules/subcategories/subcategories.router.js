import { Router } from 'express'
const router = Router({ mergeParams: true })
import * as subcategoriesController from './controller/subcategories.controller.js'
import fileUpload, { fileValidation } from '../../services/multer.js'
import { asyncHandler } from '../../middleware/errorHandling.js';

router.post('/', fileUpload(fileValidation.image).single('image'), asyncHandler(subcategoriesController.createSubCategory));
router.get('/', asyncHandler(subcategoriesController.getSubCategories));

export default router;