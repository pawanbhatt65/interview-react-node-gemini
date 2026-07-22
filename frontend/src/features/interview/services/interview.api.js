import api from "../../../BaseUrl"

/**
 * @description Generate interview report, accept job description, self description, and resume file
 * @param {*} param0 
 * @returns 
 */
export async function generateInverterReport ({jobDescription, selfDescription, resumeFile}){
    try {
        const formData = new FormData()
        formData.append("resume", resumeFile)
        formData.append("jobDescription", jobDescription)
        formData.append("selfDescription", selfDescription)

        const response = await api.post("/api/interview/", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            }
        })
        return response.data;
    } catch (error) {
        console.log("src > features > interview > services > interview.api.js > generateInverterReport catch error: ", error)
    }
}

/**
 * @description Fetch specific interview report based on interview id
 * @param {*} interviewId 
 * @returns 
 */
export const getInterviewReportById = async (interviewId)=>{
    try {
        const response = await api.get(`/api/interview/report/${interviewId}`)
        // console.log("services > interview.api.js > getInterviewReportById response: ", response)
        return response.data

    } catch (error) {
        console.log("src > features > interview > services > interview.api.js > getInterviewReportById catch error: ", error)
    }
}

/**
 * @description get all interview report a logged in user
 */
export const getAllInterviewReport = async ()=>{
    try {
        const response = await api.get(`/api/interview/reports`)
        // console.log("response interview.api.js: ", response)
        return response.data;
    } catch (error) {
        console.log("src > features > interview > services > interview.api.js > getAllInterviewReport catch error: ", error)
    }
}

/**
 * @description Service to generate resume pdf based on user self description, resume content and job description.
 */
export const generateResumePDF=async ({interviewReportId})=>{
    if (!interviewReportId) return;
    try {
        const response = await api.post(`/api/interview/resume/pdf/${interviewReportId}`, null, {
            responseType: "blob"
        })
        return response.data
    } catch (error) {
        console.log("src > features > interview > services > interview.api.js > generateResumePDF catch error: ", error)
    }
}