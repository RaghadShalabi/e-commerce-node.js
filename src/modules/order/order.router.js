import Router from 'express';
const router = Router();
import * as orderController from './controller/order.controller.js';
import { asyncHandler } from '../../middleware/errorHandling.js';
import { endPoint } from './order.endpoint.js';
import { auth } from '../../middleware/auth.js';

router.post('/', auth(endPoint.create), asyncHandler(orderController.createOrder));

export default router;