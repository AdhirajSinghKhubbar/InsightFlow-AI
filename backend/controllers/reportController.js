import Report from "../models/Report.js";

// =======================
// Get All Reports
// =======================
export const getReports = async (req, res) => {
  try {
    console.log("========== GET REPORTS ==========");
    console.log("Logged in User:", req.user.id);

    const reports = await Report.find({
      uploadedBy: req.user.id,
    })
      .populate("datasetId", "fileName")
      .sort({ createdAt: -1 });

    console.log("Reports Found:", reports.length);
    console.log(JSON.stringify(reports, null, 2));

    return res.status(200).json({
      success: true,
      count: reports.length,
      reports,
    });
  } catch (err) {
    console.error("========== GET REPORTS ERROR ==========");
    console.error(err);
    console.error("=======================================");

    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// =======================
// Get Single Report
// =======================
export const getReportById = async (req, res) => {
  try {
    console.log("========== GET REPORT BY ID ==========");
    console.log("Report ID:", req.params.id);
    console.log("Logged in User:", req.user.id);

    const report = await Report.findOne({
      _id: req.params.id,
      uploadedBy: req.user.id,
    }).populate("datasetId", "fileName");

    if (!report) {
      console.log("Report not found for this user.");

      return res.status(404).json({
        success: false,
        message: "Report not found",
      });
    }

    console.log("Report Found:", report._id);

    return res.status(200).json({
      success: true,
      report,
    });
  } catch (err) {
    console.error("========== GET REPORT BY ID ERROR ==========");
    console.error(err);
    console.error("============================================");

    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// =======================
// Delete Report
// =======================
export const deleteReport = async (req, res) => {
  try {
    console.log("========== DELETE REPORT ==========");
    console.log("Report ID:", req.params.id);
    console.log("Logged in User:", req.user.id);

    const report = await Report.findOneAndDelete({
      _id: req.params.id,
      uploadedBy: req.user.id,
    });

    if (!report) {
      return res.status(404).json({
        success: false,
        message: "Report not found",
      });
    }

    console.log("Report Deleted:", report._id);

    return res.status(200).json({
      success: true,
      message: "Report deleted successfully",
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

