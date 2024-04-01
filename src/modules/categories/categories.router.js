import { Router } from 'express'
const router = Router()
import * as categoriesController from './controller/categories.controller.js'
import fileUpload, { fileValidation } from '../../services/multer.js'
import subcategoriesRouter from '../subcategories/subcategories.router.js'
import { auth } from '../../middleware/auth.js'

router.use('/:id/subcategories', subcategoriesRouter)
router.get('/', auth(), categoriesController.getCategories);
router.get('/active', categoriesController.getActiveCategory)
router.get('/:id', categoriesController.getSpecificCategory)
router.post('/', fileUpload(fileValidation.image).single('image'), categoriesController.createCategory);
router.put('/:id', fileUpload(fileValidation.image).single('image'), categoriesController.updateCategory);
export default router;