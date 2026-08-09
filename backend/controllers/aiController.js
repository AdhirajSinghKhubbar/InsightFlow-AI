import "dotenv/config";
import { GoogleGenAI } from "@google/genai";
import Dataset from "../models/Dataset.js";
import Report from "../models/Report.js";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export const generateInsights = async (req, res) => {
  try {
    console.log("========== AI REQUEST ==========");
    console.log("Dataset ID:", req.params.id);
    console.log("User ID:", req.user.id);

    // Find dataset
    const dataset = await Dataset.findOne({
      _id: req.params.id,
      uploadedBy: req.user.id,
    });

    if (!dataset) {
      console.log("Dataset not found.");

      return res.status(404).json({
        success: false,
        message: "Dataset not found",
      });
    }

    console.log("Dataset Found:", dataset.fileName);

    // Check if report already exists
    const existingReport = await Report.findOne({
      datasetId: dataset._id,
      uploadedBy: req.user.id,
    });

    if (existingReport) {
      console.log("Returning cached report...");

      return res.status(200).json({
        success: true,
        cached: true,
        fileName: dataset.fileName,
        totalRows: dataset.data.length,
        generatedAt: existingReport.createdAt,
        insights: existingReport.report,
      });
    }

    // Prompt
    const prompt = `
You are an expert Business Data Analyst.

Analyze the following CSV dataset.

Return your response in markdown.

Use the following headings:

# Summary

# Highest Sales Observation

# Lowest Sales Observation

# Business Recommendations

Dataset:
${JSON.stringify(dataset.data)}
`;

    console.log("Calling Gemini...");

    // Gemini
    const response = await ai.models.generateContent({
      model: "models/gemini-3.6-flash",
      contents: prompt,
    });

    console.log("Gemini response received.");

    // Extract response safely
    let insights = "No insights generated.";

    if (
      response?.candidates?.length &&
      response.candidates[0]?.content?.parts
    ) {
      insights = response.candidates[0].content.parts
        .map((part) => part.text || "")
        .join("");
    }

    console.log("========== RESPONSE ==========");

    // Save report to MongoDB
    const savedReport = await Report.create({
      datasetId: dataset._id,
      uploadedBy: req.user.id,
      report: insights,
      aiModel: "Gemini 3.6 Flash",
    });

    console.log("Report saved successfully.");

    const result = {
      success: true,
      cached: false,
      fileName: dataset.fileName,
      totalRows: dataset.data.length,
      generatedAt: savedReport.createdAt,
      insights,
    };

    console.dir(result, { depth: null });

    console.log("Sending response...");
    console.log("==============================");

    return res.status(200).json(result);

  } catch (err) {
    console.log("========== GEMINI ERROR ==========");
    console.error(err);
    console.log("==================================");

    return res.status(500).json({
      success: false,
      message: err.message,
      stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
    });
  }
};

