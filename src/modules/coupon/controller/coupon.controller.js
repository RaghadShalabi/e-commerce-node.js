import couponModel from "../../../../DB/model/coupon.model.js";

export const createCoupon = async (req, res, next) => {
    const { name, amount } = req.body;
    if (await couponModel.findOne({ name })) {
        return res.status(409).json({ message: "This Coupon already exists." });
    }
    const coupon = await couponModel.create({ name, amount });
    return res.status(201).json({ message: "success", coupon });
}

export const getCoupon = async (req, res, next) => {
    const coupons = await couponModel.find({ isDeleted: false })
    return res.status(201).json({ message: "success", coupons });
}

export const updateCoupon = async (req, res, next) => {
    const coupon = await couponModel.findById(req.params.id)
    if (!coupon) {
        return res.status(409).json({ message: "Coupon not found" })
    }

    if (req.body.name) {
        if (await couponModel.findOne({ name: req.body.name })) {
            return res.status(409).json({ message: `Coupon ${req.body.name} already exists` });
        }
        coupon.name = req.body.name;
    }
    if (req.body.amount) {
        coupon.amount = req.body.amount;
    }
    await coupon.save();
    return res.status(201).json({ message: "success", coupon });
}

export const softDelete = async (req, res, next) => {
    const { id } = req.params;
    const coupon = await couponModel.findOneAndUpdate({ _id: id, isDeleted: false }, { isDeleted: true },
        { new: true });
    if (!coupon) {
        return res.status(409).json({ message: "can't delete ( put in the archive ) this coupon" })
    }
    return res.status(201).json({ message: "success" })
}

export const hardDelete = async (req, res, next) => {
    const { id } = req.params;
    const coupon = await couponModel.findOneAndDelete({ _id: id, });
    if (!coupon) {
        return res.status(409).json({ message: "can't delete this coupon" })
    }
    return res.status(201).json({ message: "success" })
}

export const restore = async (req, res, next) => {
    const { id } = req.params;
    const coupon = await couponModel.findOneAndUpdate({ _id: id, isDeleted: true }, { isDeleted: false },
        { new: true });
    if (!coupon) {
        return res.status(409).json({ message: "can't restore this coupon" })
    }
    return res.status(201).json({ message: "success" })
}




