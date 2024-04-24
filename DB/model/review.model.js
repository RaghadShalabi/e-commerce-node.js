import mongoose, { Schema, model, Types } from "mongoose";

const reviewSchema = new Schema(
  {
    comment: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    productId: {
      type: Types.ObjectId,
      ref: "Product",
      required: true,
    },
    orderId: {
      type: Types.ObjectId,
      ref: "Order",
      required: true,
    },
    createdBy: {
      type: Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

const reviewModel = model("Review", reviewSchema);
export default reviewModel;
