const Report = require('../models/Report');

// @desc    Get all reports (with optional status filtering)
// @route   GET /api/admin/reports
exports.getAdminReports = async (req, res) => {
  try {
    let query = {};
    const { status } = req.query;

    if (status) {
      query.status = status;
    } else {
      query.status = "pending"; // Default view
    }

    const reports = await Report.find(query)
      .populate('reportedBy', 'name email')
      .sort({ createdAt: -1 });

    res.json(reports);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Approve a report
// @route   PUT /api/admin/reports/:id/approve
exports.approveReport = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);
    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }

    report.status = "approved";
    const updatedReport = await report.save();
    
    // Automatically populate the reporter name before emitting
    await updatedReport.populate('reportedBy', 'name email');

    // Emit standard socket event for real-time map update to public clients
    const io = req.app.get('io');
    if (io) {
      io.emit('report_approved', updatedReport);
    }

    res.json(updatedReport);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Reject a report
// @route   PUT /api/admin/reports/:id/reject
exports.rejectReport = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);
    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }

    report.status = "rejected";
    const updatedReport = await report.save();

    res.json(updatedReport);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Permanently delete a report
// @route   DELETE /api/admin/reports/:id
exports.deleteReport = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);
    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }

    await Report.deleteOne({ _id: report._id });
    res.json({ message: "Report permanently removed" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
