import express from "express";
import { protect } from "../middlewares/authMiddleware.js";

import {
  getReports,
  getReportById,
  deleteReport,
} from "../controllers/reportController.js";

const router = express.Router();

router.get("/", protect, getReports);
router.get("/:id", protect, getReportById);
router.delete("/:id", protect, deleteReport);

export default router;