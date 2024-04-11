import jwt from "jsonwebtoken";
import userModel from "../../DB/model/user.model.js";

export const roles = {
    Admin: 'Admin',
    User: 'User',
    HR: 'HR'
}

export const auth = (accessRoles = []) => {
    return async (req, res, next) => {
        const { authorization } = req.headers;
        if (!authorization?.startsWith(process.env.BEARER_TOKEN)) {
            return res.status(409).json({ message: "Invalid authorization" })
        }
        const token = authorization.split(process.env.BEARER_TOKEN)[1]
        const decodedToken = jwt.verify(token, process.env.SIGN_IN_SECRET_KEY)

        if (!decodedToken) {
            return res.status(400).json({ message: "Invalid authorization" })
        }

        const user = await userModel.findById({ _id: decodedToken.id }).select("userName role changePasswordTime")
        if (!user) {
            return res.status(404).json({ message: "User registered not found" })
        }

        // console.log(decodedToken.iat)
        // console.log(parseInt(user.changePasswordTime.getTime()/1000))  

        if (parseInt(user.changePasswordTime?.getTime() / 1000) > decodedToken.iat) {
            return next(new Error("User changed password, please login", { cause: 400 }))
        }

        if (!accessRoles.includes(user.role)) {
            return res.status(403).json({ message: "not authorization to this user" })
        }
        req.user = user;

        next()
    }
}