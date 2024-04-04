import slugify from "slugify"
import categoryModel from "../../../../DB/model/category.model.js"
import productModel from "../../../../DB/model/product.model.js"
import subcategoryModel from "../../../../DB/model/subcategory.model.js"
import cloudinary from "../../../services/cloudinary.js"

export const getProducts = async (req, res, next) => {
    const product = await productModel.find()
    return res.status(201).json({ message: 'success', product })
}

export const createProduct = async (req, res, next) => {
    const { name, price, discount, categoryId, subCategoryId } = req.body;
    const checkCategory = await categoryModel.findById(categoryId)
    if (!checkCategory) {
        return res.status(404).json({ message: "category not found" })
    }
    const checkSubCategory = await subcategoryModel.findById(subCategoryId)
    if (!checkSubCategory) {
        return res.status(404).json({ message: "sub category not found" })
    }
    req.body.slug = slugify(name)
    req.body.finalPrice = price - (price * (discount || 0) / 100)

    const { secure_url, public_id } = await cloudinary.uploader.upload(req.files.mainImage[0].path, {
        folder: `${process.env.APP_NAME}/products/${req.body.name}/mainImage`
    })
    req.body.mainImage = { secure_url, public_id }

    req.body.subImages = []
    for (const file of req.files.subImages) {
        const { secure_url, public_id } = await cloudinary.uploader.upload(file.path, {
            folder: `${process.env.APP_NAME}/products/${req.body.name}/subImages`
        })
        req.body.subImages.push({ secure_url, public_id })
    }
    req.body.createdBy = req.user._id
    req.body.updatedBy = req.user._id
    const product = await productModel.create(req.body)
    return res.status(201).json({ message: 'success', product })
}