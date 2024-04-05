import { roles } from "../../middleware/auth.js";

export const endPoint = {
    create: [roles.User],
    getAll: [roles.User],
    delete: [roles.User],
    clear: [roles.User]
}