import { Router } from 'express'
const router = Router()
import * as productsController from './controller/products.controller.js'
import { endPoint } from '../categories/category.endpoint.js'
import fileUpload, { fileValidation } from '../../services/multer.js'
import { auth } from '../../middleware/auth.js'

router.get('/', productsController.getProducts)
router.post('/', auth(endPoint.create), fileUpload(fileValidation.image).fields([
    { name: "mainImage", maxCount: 1 },
    { name: "subImages", maxCount: 5 }
]), productsController.createProduct)
export default router
