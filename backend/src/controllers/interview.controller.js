import { PDFParse } from "pdf-parse";
import {generateInterviewReport, generateResumePDF} from "../services/ai.service.js";
import interviewReportModel from "../models/interviewReport.model.js";

/**
 * @name generateInterviewReportController
 * @description Controller to generate interview report based on user self description, resume and job description
 * @access private
 * @returns
 */
export const generateInterviewReportController = async (req, res) => {
  try {
    const resumeFile = req.file;

    // 1. Initialize the parser instance with the file buffer
    const parser = new PDFParse({ data: resumeFile.buffer });

    // 2. Await the text extraction result
    const result = await parser.getText();

    // 3. Extract the clean text content string
    const resumeContent = result.text;

    // 4. Clean up the parser instance to avoid memory leaks
    await parser.destroy();

    const { selfDescription, jobDescription } = req.body;

    const interviewReportByAI = await generateInterviewReport({
      resume: resumeContent,
      selfDescription,
      jobDescription,
    });

    // Explicit breakdown guarantees Mongoose gets exactly what it needs
    const interviewReport = await interviewReportModel.create({
      resume: resumeContent,
      selfDescription,
      jobDescription,
      user: req.user.id,
      matchScore: interviewReportByAI.matchScore || 0,
      technicalQuestion: interviewReportByAI.technicalQuestion || [],
      behavioralQuestion: interviewReportByAI.behavioralQuestion || [],
      skillGaps: interviewReportByAI.skillGaps || [],
      preparationPlan: interviewReportByAI.preparationPlan || [],
      title: interviewReportByAI.title || "",
    });

    return res.status(201).json({
      message: "Interview report generated successfully.",
      interviewReport,
    });
  } catch (error) {
    console.log(
      "src > controllers > interview.controller.js > generateInterviewReportController catch error: ",
      error,
    );
    return res.status(500).json({
      message: "Server error.",
    });
  }
};

/**
 * @name getInterviewReportByIdController
 * @description Controller to get interview report by interview id
 * @access private
 * @returns
 */
export const getInterviewReportByIdController = async (req, res) => {
  try {
    const { interviewId } = req.params;

    const interviewReport = await interviewReportModel.findOne({
      _id: interviewId,
      user: req.user.id,
    });

    if (!interviewReport) {
      return res.status(404).json({
        message: "Interview report not found.",
      });
    }

    return res.status(200).json({
      message: "Interview report fetched successfully.",
      interviewReport,
    });
  } catch (error) {
    console.log(
      "src > controllers > interview.controller.js > getInterviewReportByIdController catch error: ",
      error,
    );
    return res.status(500).json({
      message: "Server error.",
    });
  }
};

/**
 * @name getAllInterviewReportsController
 * @description Get all interview reports of logged in user
 * @access private
 * @returns
 */
export const getAllInterviewReportsController = async (req, res) => {
  try {
    const interviewReports = 
      await interviewReportModel.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .select(
        "-resume -selfDescription -jobDescription -__v -technicalQuestion -behavioralQuestion -skillGaps -preparationPlan",
      );
    //   console.log("interviewReports: ", interviewReports)

    return res.status(200).json({
      message: "Interview reports fetched successfully.",
      interviewReports,
    });
  } catch (error) {
    console.log(
      "src > controllers > interview.controller.js > getAllInterviewReportsController catch error: ",
      error,
    );
    return res.status(500).json({
      message: "Server error.",
    });
  }
};

/**
 * @name generateResumePdfController
 * @description Controller to generate resume PDF based on user self description, resume and job description.
 */
export const generateResumePdfController=async(req, res)=>{
    try {
        const {interviewReportId}=req.params;

        const interviewReport = await interviewReportModel.findById(interviewReportId)
        if (!interviewReport) {
            return res.status(404).json({
                message: "Interview report not found."
            })
        }

        const {resume, selfDescription, jobDescription} = interviewReport

        const pdfBuffer = await generateResumePDF({resume, selfDescription, jobDescription})

        res.set({
            "Content-Type": "application/pdf",
            "Content-Disposition": `attachment; filename=resume_${interviewReport._id}.pdf`
        });
        res.send(pdfBuffer);
    } catch (error) {
    console.log(
      "src > controllers > interview.controller.js > generateResumePdfController catch error: ",
      error,
    );
    return res.status(500).json({
      message: "Server error.",
    });
    }
}
