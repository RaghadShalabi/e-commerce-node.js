import slugify from "slugify";
import categoryModel from "../../../../DB/model/category.model.js";
import cloudinary from "../../../services/cloudinary.js";

export const getCategories = (req, res, next) => {
    return res.status(201).json({ message: 'categories' })
}

export const createCategory = async (req, res, next) => {
    if (!req.file) {
        return next(new Error("Please provide a file"));
    }
    const name = req.body.name.toLowerCase();
    if (await categoryModel.findOne({ name })) {
        return res.status(409).json({ message: "Category name already exists" })
    }

    const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, {
        folder: `${process.env.APP_NAME}/category`
    })

    const category = await categoryModel.create({ name, slug: slugify(name), image: { secure_url, public_id } })

    return res.status(201).json({ message: "success", category })
}