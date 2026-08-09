import express from "express";
import multer from "multer";

import { uploadCSV } from "../controllers/uploadController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

const storage = multer.memoryStorage();

const upload = multer({
  storage,
});

// Protected Upload Route
router.post(
  "/",
  protect,
  upload.single("file"),
  uploadCSV
);

export default router;