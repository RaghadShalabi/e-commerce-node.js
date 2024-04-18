import userModel from '../../../../DB/model/user.model.js';
import bcrypt from 'bcryptjs';
import cloudinary from '../../../services/cloudinary.js';
import jwt from 'jsonwebtoken';
import { sendEmail } from '../../../services/email.js';
import { customAlphabet, nanoid } from 'nanoid';

export const signUp = async (req, res, next) => {
  const { userName, email, password } = req.body;
  if (await userModel.findOne({ email })) {
    return next(new Error('email already exists', { cause: 409 }));
  }
  const hashPassword = bcrypt.hashSync(
    password,
    parseInt(process.env.SALT_ROUND),
  );
  const { secure_url, public_id } = await cloudinary.uploader.upload(
    req.file.path,
    {
      folder: `${process.env.APP_NAME}/users`,
    },
  );
  const token = jwt.sign({ email }, process.env.CONFIRM_EMAIL_SECRET_KEY);
  const html = `<h2><a href = "${req.protocol}://${req.headers.host}/auth/confirmEmail/${token}"> verify email </a></h2>`;
  await sendEmail(email, 'confirm email', html);
  const user = await userModel.create({
    userName,
    email,
    password: hashPassword,
    image: { secure_url, public_id },
  });
  return res
    .status(201)
    .json({
      message: 'account created successfully, plz verify your email to signIn',
      user,
    });
};

export const signIn = async (req, res, next) => {
  const { email, password } = req.body;
  const user = await userModel.findOne({ email });
  if (!user) {
    return next(new Error('user not found', { cause: 404 }));
  }
  if (!user.confirmEmail) {
    return next(new Error('plz confirm your email to signIn', { cause: 400 }));
  }
  const match = bcrypt.compareSync(password, user.password);
  if (!match) {
    return next(new Error('wrong password', { cause: 409 }));
  }
  const token = jwt.sign(
    { id: user._id, role: user.role, status: user.status },
    process.env.SIGN_IN_SECRET_KEY,
    { expiresIn: '1h' },
  ); //1 hour
  const refreshToken = jwt.sign(
    { id: user._id, role: user.role, status: user.status },
    process.env.SIGN_IN_SECRET_KEY,
    { expiresIn: 60 * 60 * 24 * 30 },
  ); // 1 month
  return res.status(201).json({ message: 'success', token, refreshToken });
};

export const confirmEmail = async (req, res, next) => {
  const token = req.params.token;
  const decodedToken = jwt.verify(token, process.env.CONFIRM_EMAIL_SECRET_KEY);
  if (!decodedToken) {
    return next(new Error('invalid token', { cause: 404 }));
  }
  const user = await userModel.findOneAndUpdate(
    { email: decodedToken.email, confirmEmail: false },
    { confirmEmail: true },
  );
  if (!user) {
    return next(
      new Error('invalid verify your email or your email is verified', {
        cause: 400,
      }),
    );
  }
  return res.status(201).json({ message: 'your email is verified' });
};

export const sendCode = async (req, res, next) => {
  const { email } = req.body;
  let code = customAlphabet('1234567890', 6);
  code = code();
  const html = `<h2>code is : ${code} <br> <a href='#'>to create new password click here</a></h2>`;
  await sendEmail(email, 'reset Password', html);
  const user = await userModel.findOneAndUpdate(
    { email },
    { sendCode: code },
    { new: true },
  );
  return res.status(201).json({ message: 'success', user });
};

export const forgetPassword = async (req, res, next) => {
  const { email, newPassword, code } = req.body;
  const user = await userModel.findOne({ email });
  if (!user) {
    return next(new Error('not registered account', { cause: 409 }));
  }
  if (user.sendCode != code) {
    return next(new Error('invalid code', { cause: 409 }));
  }
  let match = bcrypt.compareSync(newPassword, user.password);
  if (match) {
    return next(
      new Error('same password, Please enter another password', { cause: 409 }),
    );
  }
  const hashNewPassword = bcrypt.hashSync(
    newPassword,
    parseInt(process.env.SALT_ROUND),
  );
  user.password = hashNewPassword;
  user.sendCode = null;
  user.changePasswordTime = Date.now();
  await user.save();
  return res.status(201).json({ message: 'success' });
};

export const deleteInvalidConfirm = async (req, res, next) => {
  const users = await userModel.deleteMany({ confirmEmail: false });
  return res.status(200).json({ message: 'success' });
};
