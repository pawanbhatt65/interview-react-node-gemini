import {GoogleGenAI } from "@google/genai"
import { json } from "body-parser"
import * as z from "zod"
import {zodToJsonSchema} from "zod-to-json-schema"
import puppeteer from 'puppeteer';

const gemini_api_key = process.env.GEMINI_API_KEY

const ai = new GoogleGenAI({
    apiKey: gemini_api_key
})

// const interviewReportSchema = z.object({
//     matchScore: z.number().describe("A score between 0 and 100 indicate how well the candidate's profile matches the job description"),
//     technicalQuestion: z.array(z.object({
//         question: z.string().describe("The technical question can be asked in the interview."),
//         intention: z.string().describe("The intention of interviewer behind asking the question."),
//         answer: z.string().describe("How to anser this question, what point will cover, what approach to take etc.")
//     })).describe("Technical question that can be asked in the interview along with their intention and how to anser them."),
//     behavioralQuestion: z.array(z.object({
//         question: z.string().describe("The behavior question can be asked in the interview."),
//         intention: z.string().describe("The intention of interviewer behind asking the question."),
//         answer: z.string().describe("How to anser this question, what point will cover, what approach to take etc.")
//     })).describe("Behavioral question that can be asked in the interview along with their intention and how to anser them."),
//     skillGaps: z.array(z.object({
//         skill: z.string().describe("The skill which the candidate lacking."),
//         severity: z.enum(["low", "medium", "high"]).describe("The severity of the skill gap, i.e how important is this skill for the job")
//     })).describe("List of skill gaps in the candidate's profile along with their severity."),
//     preparationPlan: z.array(z.object({
//         day: z.number().describe("The day number in the preparation plan, starting from 1"),
//         focus: z.string().describe("The main focus in this day in the preparation plan, e.g. data structures, system design, mock interviews etc."),
//         tasks: z.array(z.string().describe("List of task to be done on this day to the follow the preparation plan. e.g. read a specific book or"))
//     })).describe("A day wise preparation plan for the candidate to the follow in order to prepare for the interview effectively")
// })

// async function generateInterviewReport ({resume, selfDescription, jobDescription}) {
//     const prompt = `
//         Generate a interview report for a candidate with the following details:
//         Resume: ${resume},
//         Self Description: ${selfDescription},
//         Job Description: ${jobDescription},
//     `

//     const response = await ai.models.generateContent({
//         model: "gemini-3.5-flash",
//         contents: prompt,
//         config: {
//             responseMimeType: "application/json",
//             responseSchema: zodToJsonSchema(interviewReportSchema),
//         }
//     })
//     // console.log(response.text);
//     return JSON.parse(response.text)
// }

export async function generateInterviewReport({ resume, selfDescription, jobDescription }) {
    const prompt = `
        You are an expert interviewer. Analyze the provided Resume, Self Description, and Job Description to generate a detailed interview preparation report.
        
        Candidate Resume: ${resume}
        Candidate Self Description: ${selfDescription}
        Target Job Description: ${jobDescription}
    `;

    // Pure JSON schema structure that Gemini natively interprets perfectly
    const nativeResponseSchema = {
        type: "object",
        properties: {
            matchScore: { 
                type: "integer", 
                description: "A score between 0 and 100 indicating how well the candidate matches the job description." 
            },
            technicalQuestion: {
                type: "array",
                description: "List of technical questions tailored to the candidate's stack and the job requirements.",
                items: {
                    type: "object",
                    properties: {
                        question: { type: "string", description: "The technical question text." },
                        intention: { type: "string", description: "The core reason the interviewer is asking this question." },
                        answer: { type: "string", description: "Comprehensive guide on how the candidate should answer this." }
                    },
                    required: ["question", "intention", "answer"]
                }
            },
            behavioralQuestion: {
                type: "array",
                description: "List of situational or behavioral questions relevant to the role.",
                items: {
                    type: "object",
                    properties: {
                        question: { type: "string", description: "The behavioral question text." },
                        intention: { type: "string", description: "What soft skill or trait the interviewer is looking for." },
                        answer: { type: "string", description: "The ideal structural approach (like STAR method) to answer." }
                    },
                    required: ["question", "intention", "answer"]
                }
            },
            skillGaps: {
                type: "array",
                description: "Skills required by the job description that are missing or weak in the candidate profile.",
                items: {
                    type: "object",
                    properties: {
                        skill: { type: "string", description: "The name of the missing skill." },
                        severity: { type: "string", enum: ["low", "medium", "high"], description: "How critical this skill is for the target job." }
                    },
                    required: ["skill", "severity"]
                }
            },
            preparationPlan: {
                type: "array",
                description: "A chronological road map to help the candidate prepare.",
                items: {
                    type: "object",
                    properties: {
                        day: { type: "integer", description: "Day number starting from 1." },
                        focus: { type: "string", description: "The core focus area for this day." },
                        tasks: { 
                            type: "array", 
                            items: { type: "string" },
                            description: "List of specific tasks or exercises to complete." 
                        }
                    },
                    required: ["day", "focus", "tasks"]
                }
            },
            title: {
                type: "string",
                description: "The title of the job for which the interview which the interview report is generated."
            }
        },
        required: ["matchScore", "technicalQuestion", "behavioralQuestion", "skillGaps", "preparationPlan"]
    };

    const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: nativeResponseSchema,
        }
    });

    // CRITICAL: Look at your console terminal when you send the request
    console.log("--- RAW GEMINI OUTPUT ---");
    // console.log(response.text);
    console.log("-------------------------");

    return JSON.parse(response.text);
}

// generate pdf
async function generatePdfFromHtml(htmlContent) {
    // Launch the browser and open a new blank page.
    // console.log("html content from generatePdfFromHtml: ", htmlContent)
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.setContent(htmlContent, {waitUntil: "networkidle0"})

    const pdfBuffer = await page.pdf({
        format: "A4", margin: {
            top: "20mm",
            bottom: "20mm",
            left: "15mm",
            right: "15mm"
        }
    })

    await browser.close()
    return pageBuffer;
}

// get a html and convert it into pdf
export async function generateResumePDF({ resume, selfDescription, jobDescription }) {
    try {
        const prompt = `
            You are an expert resume compiler. Generate an ATS-friendly, professional resume HTML document tailored to the target job description.
            
            Candidate Details:
            Resume Text: ${resume}
            Self Description: ${selfDescription}
            
            Target Job Profile:
            Job Description: ${jobDescription}

            Instructions:
            - Create complete, semantic, cleanly styled HTML using a clean sans-serif font layout.
            - Ensure it fits cleanly onto standard page dimensions.
            - Return the entire generated string under the "html" JSON response key.
            - The resume should be tailored for the given job description and should highlight the candidate's strengths and relevant experience. The HTML content should be well-formatted and structured, making it easy to read and visually appealing.
            - The content of resume should be not sound like it's generated by AI and should be as close as possible to a real human-written resume.
            you can highlight the content using some colors or different font styles but the overall design should be simple and professional.
            - The content should be ATS friendly, i.e. it should be easily parsable by ATS systems without losing important information.
            - The resume should not be so lengthy, it should ideally be 1-2 pages long when converted to PDF. Focus on quality rather than quantity and make sure to include all the relevant information that can increase the candidate's chances of getting an interview call for the given job description.
        `;

        // FIXED: Added the proper object schema framing
        const nativeResumePDFSchema = {
            type: "object",
            properties: {
                html: {
                    type: "string",
                    description: "The complete HTML code string of the compiled resume, built with inline modern CSS styling ready for standard printing."
                }
            },
            required: ["html"]
        };

        const response = await ai.models.generateContent({
            model: "gemini-3.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: nativeResumePDFSchema,
            }
        });

        console.log("--- RAW GEMINI OUTPUT for PDF ---");
        // console.log(response.text);
        console.log("-------------------------");

        const jsonContent = JSON.parse(response.text);
        
        // Pass the HTML string to your Puppeteer generator function
        const pdfBuffer = await generatePdfFromHtml(jsonContent.html);
        return pdfBuffer;

    } catch (error) {
        console.log("src > services > ai.service.js > generateResumePDF catch error: ", error);
        // FIXED: Propagate the error up to the controller where 'res' is actually available
        throw error; 
    }
}
