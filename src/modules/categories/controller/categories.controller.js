import slugify from "slugify";
import categoryModel from "../../../../DB/model/category.model.js";
import cloudinary from "../../../services/cloudinary.js";

export const getCategories = async (req, res, next) => {
    const category = await categoryModel.find();
    return res.status(201).json({ message: 'success', category })
}

export const getActiveCategory = async (req, res, next) => {
    const category = await categoryModel.find({ status: 'Active' }).select('name image -_id')
    return res.status(201).json({ message: "success", category })
}

export const updateCategory = async (req, res, next) => {
    const { id } = req.params;
    const category = await categoryModel.findById(id)
    if (!category) {
        return res.status(409).json({ message: `invalid category id ${req.params.id}` })
    }

    if (req.body.name) {
        if (await categoryModel.findOne({ name: req.body.name })) {
            return res.status(409).json({ message: `category ${req.body.name} already exits` })
        }
        category.name = req.body.name;
        category.slug = slugify(req.body.name)
    }

    if (req.body.status) {
        category.status = req.body.status;
    }

    if (req.file) {
        const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, {
            folder: `${process.env.APP_NAME}/category`
        })
        await cloudinary.uploader.destroy(category.image.public_id)
        category.image = { secure_url, public_id };
    }
    await category.save();
    return res.status(201).json({ message: "success", category })
}

export const getSpecificCategory = async (req, res, next) => {
    const { id } = req.params;
    const category = await categoryModel.findById(id)
    return res.status(201).json({ message: "success", category })
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