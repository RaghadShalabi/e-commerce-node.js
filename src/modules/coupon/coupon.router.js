import { Router } from 'express'
const router = Router()
import * as couponController from './controller/coupon.controller.js'

router.post('/', couponController.createCoupon)
router.get('/', couponController.getCoupon)
router.put('/:id', couponController.updateCoupon)
router.patch('/softDelete/:id', couponController.softDelete)
router.delete('/hardDelete/:id', couponController.hardDelete)
router.patch('/restore/:id', couponController.restore)

export default router;