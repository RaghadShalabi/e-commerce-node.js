import { Router } from 'express'
const router = Router()
import * as categoriesController from './controller/categories.controller.js'

router.get('/', categoriesController.getCategories)

export default router;