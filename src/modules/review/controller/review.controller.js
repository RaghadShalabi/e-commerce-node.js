import reviewModel from "../../../../DB/model/review.model.js";
import orderModel from "../../../../DB/model/order.model.js";

export const create = async (req, res, next) => {
  const { productId } = req.params;
  const { comment, rating } = req.body;

  const order = await orderModel.findOne({
    userId: req.user._id,
    status: "delivered",
    "products.productId": productId,
  });
  if (!order) {
    return next(
      new Error("can not review this product, order does not exist", {
        cause: 400,
      })
    );
  }
  // check if the user has already made a review for this product
  const existingReview = await reviewModel.findOne({
    createdBy: req.user._id,
    productId: productId.toString(),
  });
  if (existingReview) {
    return next(
      new Error("You have already submitted your review", { cause: 400 })
    );
  }
  const review = await reviewModel.create({
    comment,
    rating,
    createdBy: req.user._id,
    productId,
    orderId: order._id,
  });
  if (!review) {
    return next(new Error("Missing data in request body", { cause: 400 }));
  }
  return res.status(201).json({ message: "success", review });
};
