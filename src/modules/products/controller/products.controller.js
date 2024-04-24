import slugify from "slugify";
import categoryModel from "../../../../DB/model/category.model.js";
import productModel from "../../../../DB/model/product.model.js";
import subcategoryModel from "../../../../DB/model/subcategory.model.js";
import cloudinary from "../../../services/cloudinary.js";
import { pagination } from "../../../services/pagination.js";

export const getProducts = async (req, res, next) => {
  const { skip, limit } = pagination(req.query.page, req.query.limit);
  let queryObj = { ...req.query };
  const execQuery = ["page", "limit", "skip", "sort", "search", "fields"];
  execQuery.map((ele) => {
    delete queryObj[ele];
  });
  queryObj = JSON.stringify(queryObj);
  queryObj = queryObj.replace(
    /\b(gt|gte|lt|lte|in|nin|eq|neq)\b/g,
    (match) => `$${match}`
  );
  queryObj = JSON.parse(queryObj);
  const mongooseQuery = productModel.find(queryObj).skip(skip).limit(limit);

  if (req.query.search) {
    mongooseQuery.find({
      $or: [
        { name: { $regex: req.query.search, $options: "i" } },
        { description: { $regex: req.query.search, $options: "i" } },
      ],
    });
  }

  mongooseQuery.select(req.query.fields?.replaceAll(",", " "));
  const products = await mongooseQuery
    .sort(req.query.sort?.replaceAll(",", " "))
    .populate("review");
  const total = await productModel.estimatedDocumentCount();
  return res
    .status(201)
    .json({ message: "success", total, pageTotal: products.length, products });
};

export const createProduct = async (req, res, next) => {
  const { name, price, discount, categoryId, subCategoryId } = req.body;
  const checkCategory = await categoryModel.findById(categoryId);
  if (!checkCategory) {
    return next(new Error("category not found", { cause: 404 }));
  }
  const checkSubCategory = await subcategoryModel.findById(subCategoryId);
  if (!checkSubCategory) {
    return next(new Error("sub category not found", { cause: 404 }));
  }
  req.body.slug = slugify(name);
  req.body.finalPrice = price - ((price * (discount || 0)) / 100).toFixed(2);

  const { secure_url, public_id } = await cloudinary.uploader.upload(
    req.files.mainImage[0].path,
    {
      folder: `${process.env.APP_NAME}/products/${req.body.name}/mainImage`,
    }
  );
  req.body.mainImage = { secure_url, public_id };

  req.body.subImages = [];
  for (const file of req.files.subImages) {
    const { secure_url, public_id } = await cloudinary.uploader.upload(
      file.path,
      {
        folder: `${process.env.APP_NAME}/products/${req.body.name}/subImages`,
      }
    );
    req.body.subImages.push({ secure_url, public_id });
  }
  req.body.createdBy = req.user._id;
  req.body.updatedBy = req.user._id;
  const product = await productModel.create(req.body);
  return res.status(201).json({ message: "success", product });
};

export const getProductWithCategory = async (req, res, next) => {
  const products = await productModel.find({
    categoryId: req.params.categoryId,
  });
  return res.status(201).json({ message: "success", products });
};

export const getProductWithReview = async (req, res, next) => {
  const product = await productModel
    .findById(req.params.productId)
    .populate("review");
  return res.status(201).json({ message: "success", product });
};
