import { roles } from "../../middleware/auth.js";

export const endPoint = {
  uploadUerExcel: [roles.User],
};
