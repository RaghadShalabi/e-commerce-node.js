import mongoose, { Schema, model, Types } from "mongoose";

const couponSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    usedBy: [{ type: Types.ObjectId, ref: "User" }],
    expireDate: {
      type: Date,
      required: true,
    },
    createdBy: {
      type: Types.ObjectId,
      ref: "User",
    },
    updatedBy: {
      type: Types.ObjectId,
      ref: "User",
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const couponModel = model("Coupon", couponSchema);
export default couponModel;
