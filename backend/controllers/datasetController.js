import Dataset from "../models/Dataset.js";

// Latest dataset
export const getLatestDataset = async (req, res) => {
  try {
    const dataset = await Dataset.findOne({
      uploadedBy: req.user.id,
    }).sort({
      createdAt: -1,
    });

    if (!dataset) {
      return res.status(404).json({
        success: false,
        message: "No dataset found",
      });
    }

    res.status(200).json(dataset);

  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// All datasets of logged-in user
export const getAllDatasets = async (req, res) => {
  try {
    const datasets = await Dataset.find({
      uploadedBy: req.user.id,
    }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: datasets.length,
      datasets,
    });

  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// Get dataset by ID
export const getDatasetById = async (req, res) => {
  try {
    const dataset = await Dataset.findOne({
      _id: req.params.id,
      uploadedBy: req.user.id,
    });

    if (!dataset) {
      return res.status(404).json({
        success: false,
        message: "Dataset not found",
      });
    }

    res.status(200).json({
      success: true,
      dataset,
    });

  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// Delete dataset
export const deleteDataset = async (req, res) => {
  try {
    const dataset = await Dataset.findOneAndDelete({
      _id: req.params.id,
      uploadedBy: req.user.id,
    });

    if (!dataset) {
      return res.status(404).json({
        success: false,
        message: "Dataset not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Dataset deleted successfully",
    });

  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};