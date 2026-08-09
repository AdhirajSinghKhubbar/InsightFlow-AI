import express from "express";

import {
  getLatestDataset,
  getAllDatasets,
  getDatasetById,
  deleteDataset,
} from "../controllers/datasetController.js";

import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Latest dataset
router.get("/", protect, getLatestDataset);

// All datasets
router.get("/all", protect, getAllDatasets);

// Dataset by ID
router.get("/:id", protect, getDatasetById);

// Delete dataset
router.delete("/:id", protect, deleteDataset);

export default router;