import multer from "multer";

export const fileValidation = {
  image: ["image/png", "image/jpeg", "image/webp"],
  pdf: ["application.pdf"],
  excel: ["application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"],
};
function fileUpload(customValidation = []) {
  const storage = multer.diskStorage({});
  function fileFilter(req, file, cb) {
    if (customValidation.includes(file.mimetype)) {
      cb(null, true); // Accept the file
    } else {
      cb("Invalid file type", false); // Reject the file
    }
  }
  const upload = multer({ fileFilter, storage });
  return upload;
}

export default fileUpload;
