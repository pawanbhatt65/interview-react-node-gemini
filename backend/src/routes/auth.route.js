import express from "express"
import { getMeController, loginUserController, logoutUserController, registerUserController } from "../controllers/auth.controller.js";
import authUser from "../middlewares/auth.middleware.js";

const router = express.Router()

/**
 * @route POST /api/auth/register
 * @description register a new user
 * @access public
 */
router.post('/register', registerUserController)

/**
 * @route POST /api/auth/login
 * @description login user with email and password
 * @access public
 */
router.post("/login", loginUserController)

/**
 * @route GET /api/auth/logout
 * @description clear token from the cookie and add the token in blacklist
 * @access public
 */
router.get('/logout', logoutUserController)

/**
 * @route GET /api/auth/get-me
 * @description get the current logged in user details
 * @access private
 */
router.get('/get-me', authUser, getMeController)

export default router;