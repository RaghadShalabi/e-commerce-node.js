import userModel from "../../../../DB/model/user.model.js";
import bcrypt from 'bcryptjs'
import cloudinary from "../../../services/cloudinary.js";
import jwt from 'jsonwebtoken'
import { sendEmail } from "../../../services/email.js";

export const signUp = async (req, res, next) => {
    const { userName, email, password } = req.body;
    if (await userModel.findOne({ email })) {
        return res.status(409).json({ message: "email already exists" })
    }
    const hashPassword = bcrypt.hashSync(password, parseInt(process.env.SALT_ROUND))
    const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, {
        folder: `${process.env.APP_NAME}/users`
    })
    const token = jwt.sign({ email }, process.env.CONFIRM_EMAIL_SECRET_KEY)
    await sendEmail(email, "confirm email",
        `<a href = "http://localhost:3000/auth/confirmEmail/${token}"> verify email </a>`);
    const user = await userModel.create({ userName, email, password: hashPassword, image: { secure_url, public_id } });
    return res.status(201).json({ message: "success", user })
}

export const signIn = async (req, res, next) => {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email })
    if (!user) {
        return res.status(409).json({ message: "user not found" })
    }
    const match = bcrypt.compareSync(password, user.password);
    if (!match) {
        return res.status(409).json({ message: "wrong password" });
    }
    const token = jwt.sign({ id: user._id, role: user.role, status: user.status }, process.env.SIGN_IN_SECRET_KEY,
        { expiresIn: '1h' })//1 hour
    const refreshToken = jwt.sign({ id: user._id, role: user.role, status: user.status }, process.env.SIGN_IN_SECRET_KEY,
        { expiresIn: 60 * 60 * 24 * 30 })// 1 month
    return res.status(201).json({ message: "success", token, refreshToken })
}

export const confirmEmail = async (req, res, next) => {
    const token = req.params.token;
    const decodedToken = jwt.verify(token, process.env.CONFIRM_EMAIL_SECRET_KEY);
    if (!decodedToken) {
        return res.status(404).json({ message: "invalid token" })
    }
    const user = await userModel.findOneAndUpdate({ email: decodedToken.email, confirmEmail: false }, { confirmEmail: true })
    if (!user) {
        return res.status(400).json({ message: "invalid verify your email or your email is verified" })
    }
    return res.status(201).json({ message: "your email is verified" })
}