import { Router } from 'express'
const router = Router()
import * as productsController from './controller/products.controller.js'

router.get('/', productsController.getProducts)

export default router
