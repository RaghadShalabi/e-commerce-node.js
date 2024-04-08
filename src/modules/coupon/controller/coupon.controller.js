import couponModel from "../../../../DB/model/coupon.model.js";

export const createCoupon = async (req, res, next) => {
    const { name, amount } = req.body;
    if (await couponModel.findOne({ name })) {
        return next(new Error("This Coupon already exists.",{cause:409}))
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
        return next(new Error("Coupon not found",{cause:409}))
    }

    if (req.body.name) {
        if (await couponModel.findOne({ name: req.body.name })) {
            return next(new Error(`Coupon ${req.body.name} already exists`,{cause:409}))
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
        return next(new Error("can't delete ( put in the archive ) this coupon",{cause:409}))
    }
    return res.status(201).json({ message: "success" })
}

export const hardDelete = async (req, res, next) => {
    const { id } = req.params;
    const coupon = await couponModel.findOneAndDelete({ _id: id, isDeleted: true });
    if (!coupon) {
        return next(new Error("can't delete this coupon",{cause:409}))
    }
    return res.status(201).json({ message: "success" })
}

export const restore = async (req, res, next) => {
    const { id } = req.params;
    const coupon = await couponModel.findOneAndUpdate({ _id: id, isDeleted: true }, { isDeleted: false },
        { new: true });
    if (!coupon) {
        return next(new Error("can't restore this coupon",{cause:409}))
    }
    return res.status(201).json({ message: "success" })
}




