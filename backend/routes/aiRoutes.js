import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import { generateInsights } from "../controllers/aiController.js";

const router = express.Router();

router.get("/:id", protect, generateInsights);

export default router;