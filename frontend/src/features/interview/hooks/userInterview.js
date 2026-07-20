import {
  generateInverterReport,
  getInterviewReportById,
  getAllInterviewReport,
  generateResumePDF,
} from "../services/interview.api";
import { useContext, useEffect } from "react";
import { InterviewContext } from "../interview.context";
import { useParams } from "react-router";

export const useInterview = () => {
  const context = useContext(InterviewContext);
  if (!context)
    throw new Error("useInterview must be use within interview provider.");

  const { interviewId } = useParams();

  const { loading, setLoading, report, setReport, reports, setReports } =
    context;

  const generateReport = async ({
    jobDescription,
    selfDescription,
    resumeFile,
  }) => {
    setLoading(true);
    let interviewReportData = null;
    try {
      const response = await generateInverterReport({
        jobDescription,
        selfDescription,
        resumeFile,
      });
      //   console.log("response from userInterview.js: ", response);
      setReport(response.interviewReport);
      interviewReportData = response.interviewReport;
    } catch (error) {
      console.log(
        "src > features > interview > hooks > useInterview.js > generateReport catch error: ",
        error,
      );
    } finally {
      setLoading(false);
    }
    return interviewReportData;
  };

  const getReportById = async (interviewId) => {
    if (!interviewId) return;
    setLoading(true);
    let interviewReportData = null;
    try {
      const response = await getInterviewReportById(interviewId);
      if (response) {
        setReport(response.interviewReport);
        interviewReportData = response.interviewReport;
      }
    } catch (error) {
      console.log(
        "src > features > interview > hooks > useInterview.js > getReportById catch error: ",
        error,
      );
    } finally {
      setLoading(false);
    }
    return interviewReportData;
  };

  const getReports = async () => {
    setLoading(true);
    try {
      const response = await getAllInterviewReport();
      const interviewReports = response?.interviewReports ?? [];
      setReports(interviewReports);
      //   console.log("response is userInterview.js: ", response);
      setLoading(false);
      return interviewReports;
    } catch (error) {
      console.log(
        "src > features > interview > hooks > useInterview.js > getReports catch error: ",
        error,
      );
      setLoading(false);
      throw error;
    }
  };

  const getResumePdf = async (interviewReportId) => {
    setLoading(true);
    try {
      let response = await generateResumePDF({ interviewReportId });
      const url = window.URL.createObjectURL(
        new Blob([response], { type: "application/pdf" }),
      );
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `resume_${interviewReportId}.pdf`);
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (interviewId) {
      getReportById(interviewId);
    } else {
      getReportById();
    }
  }, [interviewId]);

  return {
    loading,
    report,
    reports,
    generateReport,
    getReportById,
    getReports,
    getResumePdf,
  };
};
