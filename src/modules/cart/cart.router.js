import { Router } from 'express'
import * as cartController from './controller/cart.controller.js'
import { endPoint } from './cart.endpoint.js';
import { auth } from '../../middleware/auth.js';
import { asyncHandler } from '../../middleware/errorHandling.js';
const router = Router()

router.post('/', auth(endPoint.create), asyncHandler(cartController.createCart))
router.patch('/removeItem', auth(endPoint.delete), asyncHandler(cartController.removeItem))
router.patch('/clear', auth(endPoint.clear), asyncHandler(cartController.clearCart))
router.get('/', auth(endPoint.getAll), asyncHandler(cartController.getCart))
export default router; 