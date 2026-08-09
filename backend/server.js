import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import User from "./models/User.js";

import authRoutes from "./routes/authRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import datasetRoutes from "./routes/datasetRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";
import reportRoutes from "./routes/reportRoutes.js";

dotenv.config();
console.log("========== ENV CHECK ==========");
console.log("API Key Exists:", !!process.env.GEMINI_API_KEY);
console.log(
  "API Key Prefix:",
  process.env.GEMINI_API_KEY?.substring(0, 10)
);
console.log("================================");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(cookieParser());

// Home Route
app.get("/", (req, res) => {
  res.json({
    message: "InsightFlow AI Backend Running 🚀",
  });
});

// Temporary Route to View All Users
app.get("/users", async (req, res) => {
  try {
    const users = await User.find();

    res.json(users);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Error fetching users",
    });
  }
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/dataset", datasetRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/reports", reportRoutes);

// Server
const PORT = process.env.PORT || 5001;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB Connected");

    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB Connection Error:", err);
  });