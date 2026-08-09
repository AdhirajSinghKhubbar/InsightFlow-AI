import mongoose from "mongoose";

const reportSchema = new mongoose.Schema(
  {
    datasetId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Dataset",
      required: true,
    },

    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    report: {
      type: String,
      required: true,
    },

    aiModel: {
      type: String,
      default: "Gemini 3.6 Flash",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Report", reportSchema);