import express from "express"

import authUser from "../middlewares/auth.middleware.js"
import { generateInterviewReportController, generateResumePdfController, getAllInterviewReportsController, getInterviewReportByIdController } from "../controllers/interview.controller.js"
import upload from "../middlewares/file.middleware.js"

const router = express.Router()

/**
 * @route POST /api/interview/
 * @description Generate new interview report on the basis of user self description, resume pdf and job description.
 * @access private
 */

router.post("/", authUser, upload.single("resume"), generateInterviewReportController)

/**
 * @route GET /api/interview/report/:interviewId
 * @description Get interview report by interviewId
 * @access private
 */
router.get("/report/:interviewId", authUser, getInterviewReportByIdController)

/**
 * @route GET /api/interview/
 * @description Get all interview of logged in user
 * @access private
 */
router.get("/reports", authUser, getAllInterviewReportsController)

/**
 * @route POST /api/interview/resume/:interviewReportId
 * @description Generate resume PDF on the basis of user self description, resume content and job description.
 * @access private
 */
router.post("/resume/pdf/:interviewReportId", authUser, generateResumePdfController)


export default router