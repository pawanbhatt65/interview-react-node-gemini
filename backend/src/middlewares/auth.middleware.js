import jwt from "jsonwebtoken"
import tokenBlacklistModel from "../models/blacklist.model.js";

const jwt_secret = process.env.JWT_SECRET;

const authUser =async(req, res, next)=>{
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({
            message: "Token not provided."
        })
    }

    // check token is black list or not
    const isTokenBlacklisted = await tokenBlacklistModel.findOne({token})
    if (isTokenBlacklisted) {
        return res.status(401).json({
            message: "Token is invalid.",
        })
    }

    try {
        const decoded = await jwt.verify(token, jwt_secret)

        req.user = decoded;
        next();
    } catch (error) {
        console.log("src > middlewares > auth.middleware.js > authUser catch error: ", error)
        return res.status(401).json({
            "message": "Server error."
        })
    }
}

export default authUser