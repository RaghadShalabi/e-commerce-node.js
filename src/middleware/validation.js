import joi from "joi";

export const generalFields = {
  email: joi.string().email().required().messages({
    "string.empty": "email is required",
    "string.email": "plz enter a valid email",
    "string.base": "email must be string",
  }),
  password: joi.string().required().min(3).messages({
    "string.empty": "password is required",
    "string.min": "password length at least 6 characters long",
  }),
  file: joi.object({
    size: joi.number().positive().required(),
    path: joi.string().required(),
    filename: joi.string().required(),
    destination: joi.string().required(),
    mimetype: joi.string().required(),
    encoding: joi.string().required(),
    originalname: joi.string().required(),
    fieldname: joi.string().required(),
    dest: joi.string(),
  }),
};

export const validation = (schema) => {
  return (req, res, next) => {
    const inputsData = { ...req.body, ...req.query, ...req.params };
    //return res.json(inputsData)

    if (req.file || req.files) {
      inputsData.file = req.file || req.files;
    }
    const validationResult = schema.validate(inputsData, { abortEarly: false });
    if (validationResult.error?.details) {
      return res.status(400).json({
        message: "validation error",
        validationError: validationResult.error?.details,
      });
    }
    next();
  };
};
