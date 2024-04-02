import { Router } from 'express'
const router = Router({ mergeParams: true })
import * as subcategoriesController from './controller/subcategories.controller.js'
import fileUpload, { fileValidation } from '../../services/multer.js'

router.post('/', fileUpload(fileValidation.image).single('image'), subcategoriesController.createSubCategory);
router.get('/', subcategoriesController.getSubCategories);

export default router;