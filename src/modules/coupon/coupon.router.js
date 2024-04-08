import { Router } from 'express'
const router = Router()
import * as couponController from './controller/coupon.controller.js'
import { asyncHandler } from '../../middleware/errorHandling.js'

router.post('/', asyncHandler(couponController.createCoupon))
router.get('/', asyncHandler(couponController.getCoupon))
router.put('/:id', asyncHandler(couponController.updateCoupon))
router.patch('/softDelete/:id', asyncHandler(couponController.softDelete))
router.delete('/hardDelete/:id', asyncHandler(couponController.hardDelete))
router.patch('/restore/:id', asyncHandler(couponController.restore))

export default router;