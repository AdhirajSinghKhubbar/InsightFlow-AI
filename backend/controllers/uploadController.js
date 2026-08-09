import Papa from "papaparse";
import Dataset from "../models/Dataset.js";

export const uploadCSV = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    const csv = req.file.buffer.toString();

    const parsed = Papa.parse(csv, {
      header: true,
      skipEmptyLines: true,
    });

    const dataset = await Dataset.create({
      fileName: req.file.originalname,
      uploadedBy: req.user.id,   // ✅ Save logged-in user's ID
      data: parsed.data,
    });

    res.status(201).json({
      success: true,
      message: "Dataset uploaded successfully",
      dataset,
    });

  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: "Upload Failed",
    });
  }
};