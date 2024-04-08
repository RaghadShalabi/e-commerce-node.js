import { Router } from 'express'
const router = Router()
import * as productsController from './controller/products.controller.js'
import fileUpload, { fileValidation } from '../../services/multer.js'
import { auth } from '../../middleware/auth.js'
import { endPoint } from './products.endpoint.js'
import { asyncHandler } from '../../middleware/errorHandling.js'

router.get('/', auth(endPoint.getAll), asyncHandler(productsController.getProducts))
router.post('/', auth(endPoint.create), fileUpload(fileValidation.image).fields([
    { name: "mainImage", maxCount: 1 },
    { name: "subImages", maxCount: 5 }
]), asyncHandler(productsController.createProduct))
export default router
