import userModel from "../../../../DB/model/user.model.js";
import bcrypt from 'bcryptjs'
import cloudinary from "../../../services/cloudinary.js";
import jwt from 'jsonwebtoken'
import { sendEmail } from "../../../services/email.js";
import { customAlphabet, nanoid } from "nanoid";

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
    const html = `<h2><a href = "${req.protocol}://${req.headers.host}/auth/confirmEmail/${token}"> verify email </a></h2>`
    await sendEmail(email, "confirm email", html);
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

export const sendCode = async (req, res, next) => {
    const { email } = req.body;
    let code = customAlphabet('1234567890', 6)
    code = code();
    const html = `<h2>code is : ${code} <br> <a href='#'>to create new password click here</a></h2>`;
    await sendEmail(email, "reset Password", html);
    const user = await userModel.findOneAndUpdate({ email }, { sendCode: code }, { new: true })
    return res.status(201).json({ message: "success", user })
}

export const forgetPassword = async (req, res, next) => {
    const { email, newPassword, code } = req.body;
    const user = await userModel.findOne({ email })
    if (!user) {
        return res.status(409).json({ message: "not registered account" })
    }
    if (user.sendCode != code) {
        return res.status(409).json({ message: "invalid code" })
    }
    let match = bcrypt.compareSync(newPassword, user.password);
    if (match) {
        return res.status(409).json({ message: "same password, Please enter another password" })
    }
    const hashNewPassword = bcrypt.hashSync(newPassword, parseInt(process.env.SALT_ROUND))
    user.password = hashNewPassword;
    user.sendCode = null;
    await user.save();
    return res.status(201).json({ message: "success" })
}