
import ErrorHandler from "../utils/error.js";
import JWT from "jsonwebtoken"
export const isLoggedIn = (req, res, next) => {
    try {
        const token = req.cookies.token

        if (!token) {
            return next(new ErrorHandler("user is not login", 400))
        }

        const payload = JWT.verify(token, process.env.JWT_SECRET);
        req.user = {
            id: payload.id,
            email: payload.email,
            mobileNumber: payload.mobileNumber,
            role: payload.role
        }


        next();
    } catch (error) {
        return next(new ErrorHandler(error.message, 400))
    }
}

export const isAuthorized = function (...roles) {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(new ErrorHandler("you cannot access this route your are not authorized", 400))
        }
        next();
    }
}