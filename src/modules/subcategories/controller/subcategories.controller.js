import slugify from "slugify";
import categoryModel from "../../../../DB/model/category.model.js";
import subcategoryModel from "../../../../DB/model/subcategory.model.js";
import cloudinary from "../../../services/cloudinary.js";

export const createSubCategory = async (req, res, next) => {
    const { name, categoryId } = req.body;
    const subcategory = await subcategoryModel.findOne({ name });
    if (subcategory) {
        return res.status(409).json({ message: `sub category ${name} already exists.` });
    }
    const category = await categoryModel.findById(categoryId)
    if (!category) {
        return res.status(409).json({ message: `category not found` })
    }
    const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, {
        folder: `${process.env.APP_NAME}/subcategories`
    });
    const newSubCategory = await subcategoryModel.create({ name, slug: slugify(name), categoryId, image: { secure_url, public_id } })
    return res.status(201).json({ message: "success", newSubCategory })
}

export const getSubCategories = async (req, res, next) => {
    const categoryId = req.params.id;
    const category = await categoryModel.findById(categoryId)
    if (!category) {
        return res.status(409).json({ message: "category not found" })
    }
    const subcategories = await subcategoryModel.find({ categoryId }).populate({
        path: 'categoryId'
    });
    return res.status(201).json({ message: "success", subcategories })
}