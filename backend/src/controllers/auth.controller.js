import userModel from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken"
import dotenv from "dotenv"
import tokenBlacklistModel from "../models/blacklist.model.js";


dotenv.config()


const jwt_secret = process.env.JWT_SECRET;

/**
 * @name registerUserController
 * @description register a new user, except username, email and password
 * @access Public
 */

export const registerUserController=async(req, res)=>{
    try {
        const {username, email, password}=req.body;
        if (!username || !email || !password) {
            return res.status(400).json({
                message: "Please provide username, email, and password."
            })
        }

        /**
         * check user exist either username or email
         */
        const isUserAlreadyExist = await userModel.findOne({
            $or: [{username}, {email}]
        })
        if (isUserAlreadyExist) {
            return res.status(400).json({
                message: "User is already exist with this username or email."
            })
        }

        const hash = await bcrypt.hash(password, 10)

        const user = await userModel.create({
            username,
            email,
            password: hash,
        })

        // console.log("jwt secret: ", jwt_secret)
        const token = await jwt.sign(
            {id: user._id, username: user.username},jwt_secret, { expiresIn: "1d" }
        )

        // res.cookie("token", token)
        const isProduction = process.env.NODE_ENV === "production";

        res.cookie("token", token, {
            httpOnly: true,
            secure: isProduction,
            sameSite: isProduction ? "none" : "lax",
            maxAge: 24 * 60 * 60 * 1000,
        });

        return res.status(201).json({
            message: "User register successfully.",
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
            }
        })
    } catch (error) {
        console.log("src > controllers > auth.controller.js > registerUserController catch error: ", error)
        return res.status(500).json({
            "message": "Server error."
        })
    }
}

/**
 * @name loginUserController
 * @description login a user, except user email and password in request body 
 * @access public
 */
export const loginUserController=async(req, res)=>{
    try {
        const {email, password}=req.body;

        // check email is exist in db or not
        const user = await userModel.findOne({email})
        if (!user) {
            return res.status(400).json({
                message: "Invalid email or password.",
            })
        }

        const isPasswordValid = await bcrypt.compare(password, user.password)
        if (!isPasswordValid) {
            return res.status(400).json({
                message: "Invalid email or password."
            })
        }

        const token = await jwt.sign(
            {id: user._id, username: user.username},jwt_secret, {expiresIn: "1d"}
        )

        // res.cookie("token", token)

        // res.cookie("token", token)
        const isProduction = process.env.NODE_ENV === "production";

        res.cookie("token", token, {
            httpOnly: true,
            secure: isProduction,
            sameSite: isProduction ? "none" : "lax",
            maxAge: 24 * 60 * 60 * 1000,
        });

        return res.status(200).json({
            message: "User loggedIn successfully.",
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
            }
        })
    } catch (error) {
        console.log("src > controllers > auth.controller.js > loginUserController catch error: ", error)
        return res.status(500).json({
            "message": "Server error."
        })
    }
}

/**
 * @name logoutUserController
 * @description user will be logout, clear token from cookie and do blacklist
 * @access public
 */
export const logoutUserController =async (req, res)=>{
    try {
        const token = req.cookies.token;
        if (token) {
            await tokenBlacklistModel.create({
                token,
            })
        }
        res.clearCookie("token")

        return res.status(200).json({
            "message": "User logout successfully."
        })
    } catch (error) {
        console.log("src > controllers > auth.controller.js > logoutUserController catch error: ", error)
        return res.status(500).json({
            "message": "Server error."
        })
    }
}

/**
 * @name getMeController
 * @description get the logged in user details and checked the user token blacklist or not
 * @access protected
 */
export const getMeController=async(req, res)=>{
    try {
        const user = await userModel.findById(req.user.id)

        return res.status(200).json({
            message: "User details fetched successfully.",
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
            }
        })
    } catch (error) {
        console.log("src > controllers > auth.controller.js > getMeController catch error: ", error)
        return res.status(500).json({
            "message": "Server error."
        })
    }
}