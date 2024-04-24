import Router from "express";
const router = Router();
import * as orderController from "./controller/order.controller.js";
import { asyncHandler } from "../../middleware/errorHandling.js";
import { endPoint } from "./order.endpoint.js";
import { auth } from "../../middleware/auth.js";

router.post(
  "/",
  auth(endPoint.create),
  asyncHandler(orderController.createOrder)
);
router.get("/", auth(endPoint.get), asyncHandler(orderController.getOrders));
router.patch(
  "/cancel/:orderId",
  auth(endPoint.cancel),
  asyncHandler(orderController.cancelOrder)
);
router.patch(
  "/changeStatus/:orderId",
  auth(endPoint.changeStatus),
  asyncHandler(orderController.changeStatus)
);
export default router;
