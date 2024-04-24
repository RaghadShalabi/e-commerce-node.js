import mongoose, { Schema, model, Types } from "mongoose";

const productSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    slug: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    stock: {
      type: Number,
      default: 1,
    },
    price: {
      type: Number,
      required: true,
    },
    finalPrice: {
      type: Number,
      default: 0,
    },
    discount: {
      type: Number,
      default: 0,
    },
    number_sellers: {
      type: Number,
      default: 0,
    },
    mainImage: {
      type: Object,
      required: true,
    },
    subImages: {
      type: Object,
      required: true,
    },
    status: {
      type: String,
      default: "Active",
      enum: ["Active", "Inactive"],
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    colors: {
      type: [String],
    },
    size: {
      type: String,
      enum: ["s", "m", "lg", "xl"],
    },
    categoryId: {
      type: Types.ObjectId,
      ref: "Category",
      required: true,
    },
    subCategoryId: {
      type: Types.ObjectId,
      ref: "subCategory",
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
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

productSchema.virtual("review", {
  ref: "Review",
  localField: "_id",
  foreignField: "productId",
});

const productModel = model("Product", productSchema);
export default productModel;
