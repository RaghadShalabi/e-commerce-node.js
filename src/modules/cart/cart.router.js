import { Router } from 'express'
import * as cartController from './controller/cart.controller.js'
import { endPoint } from './cart.endpoint.js';
import { auth } from '../../middleware/auth.js';
const router = Router()

router.post('/', auth(endPoint.create), cartController.createCart)
router.patch('/removeItem', auth(endPoint.delete), cartController.removeItem)
router.patch('/clear', auth(endPoint.clear), cartController.clearCart)
router.get('/', auth(endPoint.getAll), cartController.getCart)
export default router; 