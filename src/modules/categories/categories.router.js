import { Router } from 'express'
const router = Router()
import * as categoriesController from './controller/categories.controller.js'
import fileUpload, { fileValidation } from '../../services/multer.js'

router.get('/', categoriesController.getCategories);
router.get('/active', categoriesController.getActiveCategory)
router.get('/:id', categoriesController.getSpecificCategory)
router.post('/', fileUpload(fileValidation.image).single('image'), categoriesController.createCategory);
router.put('/:id', fileUpload(fileValidation.image).single('image'), categoriesController.updateCategory);
export default router;