import mongoose from "mongoose";

const datasetSchema = new mongoose.Schema(
  {
    fileName: {
      type: String,
      required: true,
    },

    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    data: {
      type: Array,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Dataset", datasetSchema);