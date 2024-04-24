import XLSX from "xlsx";
import userModel from "../../../../DB/model/user.model.js";
import { createPdf } from "../../../services/pdf.js";

export const getProfile = async (req, res, next) => {
  const user = await userModel.findById(req.user._id);
  return res.status(201).json({ message: "success", user });
};

export const uploadUserExcel = async (req, res, next) => {
  const workBook = XLSX.readFile(req.file.path);
  const workSheet = workBook.Sheets[workBook.SheetNames[0]];
  const users = XLSX.utils.sheet_to_json(workSheet);
  if (!(await userModel.insertMany(users))) {
    return next(new Error(`Could not insert`, { cause: 400 }));
  }
  return res.status(201).json({ message: "success", users });
};

export const getUsers = async (req, res, next) => {
  let users = await userModel.find({}).lean();
  await createPdf(users, "listUsers.pdf", req, res);
  //return res.status(201).json({message:"success",users})
};
