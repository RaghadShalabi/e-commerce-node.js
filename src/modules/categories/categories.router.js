import { Router } from 'express'
const router = Router()
import * as categoriesController from './controller/categories.controller.js'
import fileUpload, { fileValidation } from '../../services/multer.js'

router.get('/', categoriesController.getCategories);
router.post('/',fileUpload(fileValidation.image).single('image'), categoriesController.createCategory);

export default router;