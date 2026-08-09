import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../../api/axios";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { jsPDF } from "jspdf";

export default function ReportDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [report, setReport] = useState(null);

  // ================================
  // Fetch Report
  // ================================
  useEffect(() => {
    fetchReport();
  }, [id]);

  async function fetchReport() {
    try {
      const response = await API.get(`/reports/${id}`);

      console.log("Report Response:", response.data);

      if (response.data.success && response.data.report) {
        setReport(response.data.report);
      }
    } catch (error) {
      console.error("Failed to load report:", error);
    } finally {
      setLoading(false);
    }
  }

  // ================================
  // Download Markdown
  // ================================
  function downloadMarkdown() {
    if (!report) return;

    const datasetName =
      report.datasetId?.fileName || "AI_Report";

    const markdownContent = `# InsightFlow AI - Business Report

Dataset: ${datasetName}

AI Model: ${report.aiModel || "AI"}

Generated: ${
      report.createdAt
        ? new Date(report.createdAt).toLocaleString()
        : "Unknown"
    }

---

${report.report || "No report content available."}
`;

    const blob = new Blob([markdownContent], {
      type: "text/markdown;charset=utf-8",
    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;

    link.download = `${datasetName.replace(
      /\.[^/.]+$/,
      ""
    )}-AI-Report.md`;

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  }

  // ================================
  // Download PDF
  // ================================
  function downloadPDF() {
    if (!report) return;

    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    const datasetName =
      report.datasetId?.fileName || "AI Report";

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    const margin = 15;
    const usableWidth = pageWidth - margin * 2;

    let y = 20;

    // ================================
    // Title
    // ================================
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(20);

    pdf.text("InsightFlow AI", margin, y);

    y += 10;

    pdf.setFontSize(15);

    pdf.text("AI Business Report", margin, y);

    y += 12;

    // ================================
    // Report Information
    // ================================
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(10);

    pdf.text(
      `Dataset: ${datasetName}`,
      margin,
      y
    );

    y += 6;

    pdf.text(
      `AI Model: ${report.aiModel || "AI"}`,
      margin,
      y
    );

    y += 6;

    pdf.text(
      `Generated: ${
        report.createdAt
          ? new Date(
              report.createdAt
            ).toLocaleString()
          : "Unknown"
      }`,
      margin,
      y
    );

    y += 10;

    // ================================
    // Divider
    // ================================
    pdf.line(
      margin,
      y,
      pageWidth - margin,
      y
    );

    y += 10;

    // ================================
    // Report Content
    // ================================
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(10);

    const cleanReport = (
      report.report ||
      "No report content available."
    )
      .replace(/^#{1,6}\s*/gm, "")
      .replace(/\*\*(.*?)\*\*/g, "$1")
      .replace(/\*(.*?)\*/g, "$1")
      .replace(/`(.*?)`/g, "$1")
      .replace(/^[-*]\s+/gm, "• ")
      .replace(/^\d+\.\s+/gm, "")
      .replace(/\n{3,}/g, "\n\n");

    const lines = pdf.splitTextToSize(
      cleanReport,
      usableWidth
    );

    for (let i = 0; i < lines.length; i++) {
      // New page when necessary
      if (y > pageHeight - 20) {
        pdf.addPage();

        y = 20;
      }

      pdf.text(lines[i], margin, y);

      y += 5;
    }

    // ================================
    // Footer
    // ================================
    const totalPages =
      pdf.internal.getNumberOfPages();

    for (
      let page = 1;
      page <= totalPages;
      page++
    ) {
      pdf.setPage(page);

      pdf.setFontSize(8);

      pdf.setTextColor(
        120,
        120,
        120
      );

      pdf.text(
        `InsightFlow AI • Page ${page} of ${totalPages}`,
        margin,
        pageHeight - 8
      );

      pdf.setTextColor(
        0,
        0,
        0
      );
    }

    // ================================
    // Save PDF
    // ================================
    const fileName = `${datasetName.replace(
      /\.[^/.]+$/,
      ""
    )}-AI-Report.pdf`;

    pdf.save(fileName);
  }

  // ================================
  // Loading
  // ================================
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <h1 className="text-3xl font-bold text-blue-600">
          Loading Report...
        </h1>
      </div>
    );
  }

  // ================================
  // Report Not Found
  // ================================
  if (!report) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white rounded-xl shadow-lg p-10 text-center">
          <h1 className="text-3xl font-bold text-red-600">
            Report Not Found
          </h1>

          <button
            onClick={() => navigate("/reports")}
            className="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg"
          >
            ← Back to Reports
          </button>
        </div>
      </div>
    );
  }

  const datasetName =
    report.datasetId?.fileName ||
    "Unknown Dataset";

  // ================================
  // Main UI
  // ================================
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">

        {/* ============================
            Header
        ============================ */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8">

          <div>
            <h1 className="text-4xl font-bold text-blue-600">
              AI Business Report
            </h1>

            <p className="text-gray-500 mt-2">
              Generated from your uploaded dataset
            </p>
          </div>

          <div className="flex flex-wrap gap-3">

            <button
              onClick={() => navigate("/reports")}
              className="bg-gray-600 hover:bg-gray-700 text-white px-5 py-3 rounded-lg font-semibold transition"
            >
              ← Back
            </button>

            <button
              onClick={downloadPDF}
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-lg font-semibold transition"
            >
              ↓ Download PDF
            </button>

          </div>
        </div>

        {/* ============================
            Report Information
        ============================ */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">

          {/* Dataset */}
          <div className="bg-white rounded-xl shadow-lg p-6">

            <p className="text-gray-500 text-sm">
              Dataset
            </p>

            <p className="text-xl font-bold text-blue-600 mt-2 break-words">
              📄 {datasetName}
            </p>

          </div>

          {/* AI Model */}
          <div className="bg-white rounded-xl shadow-lg p-6">

            <p className="text-gray-500 text-sm">
              AI Model
            </p>

            <p className="text-xl font-bold text-purple-600 mt-2">
              🤖 {report.aiModel || "AI"}
            </p>

          </div>

          {/* Generated */}
          <div className="bg-white rounded-xl shadow-lg p-6">

            <p className="text-gray-500 text-sm">
              Generated
            </p>

            <p className="text-xl font-bold text-orange-600 mt-2">
              {report.createdAt
                ? new Date(
                    report.createdAt
                  ).toLocaleString()
                : "Unknown"}
            </p>

          </div>

        </div>

        {/* ============================
            AI Report
        ============================ */}
        <div className="bg-white rounded-xl shadow-xl p-8">

          <div className="flex justify-between items-center mb-6">

            <h2 className="text-2xl font-bold">
              AI Analysis
            </h2>

            <button
              onClick={downloadPDF}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold"
            >
              📄 Download PDF
            </button>

          </div>

          <div className="prose prose-lg max-w-none">

            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
            >
              {
                report.report ||
                "No report content available."
              }
            </ReactMarkdown>

          </div>

        </div>

      </div>
    </div>
  );
}