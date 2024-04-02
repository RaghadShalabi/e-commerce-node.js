import { Router } from 'express'
const router = Router()
import * as categoriesController from './controller/categories.controller.js'
import fileUpload, { fileValidation } from '../../services/multer.js'
import subcategoriesRouter from '../subcategories/subcategories.router.js'
import { auth } from '../../middleware/auth.js'
import { endPoint } from './category.endpoint.js'

router.use('/:id/subcategories', subcategoriesRouter)
router.get('/', auth(endPoint.getAll), categoriesController.getCategories);
router.get('/active', auth(endPoint.getActive), categoriesController.getActiveCategory)
router.get('/:id', auth(endPoint.specific), categoriesController.getSpecificCategory)
router.post('/', auth(endPoint.create), fileUpload(fileValidation.image).single('image'), categoriesController.createCategory);
router.put('/:id', auth(endPoint.update), fileUpload(fileValidation.image).single('image'), categoriesController.updateCategory);
export default router;