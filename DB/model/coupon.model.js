import mongoose, { Schema, model, Types } from "mongoose";

const couponSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    amount: {
        type: Number,
        required: true
    },
    usedBy: [{ type: Types.ObjectId, ref: 'USer' }],
    expireDate: Date,
    createdBy: {
        type: Types.ObjectId,
        ref: 'User'
    },
    updatedBy: {
        type: Types.ObjectId,
        ref: 'User'
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
})

const couponModel = model('Coupon', couponSchema)
export default couponModel;