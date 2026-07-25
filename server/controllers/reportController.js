const Report = require('../models/Report');
const cloudinary = require('../config/cloudinary');
const streamifier = require('streamifier');

// Helper function to upload to Cloudinary using a stream
const uploadToCloudinary = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    let cld_upload_stream = cloudinary.uploader.upload_stream(
      { folder: "ocean_insight" },
      (error, result) => {
        if (result) {
          resolve(result);
        } else {
          reject(error);
        }
      }
    );
    streamifier.createReadStream(fileBuffer).pipe(cld_upload_stream);
  });
};

const severityRank = {
  "Informational": 1,
  "Standard": 2,
  "Medium": 2,
  "High": 3,
  "Critical": 4
};

// AI Classification Helper
const classifyHazard = (description) => {
  const descLower = description.toLowerCase();
  let hazardType = null;
  let severity = null;
  let confidence = false;

  // Keyword mappings
  if (descLower.includes('oil') || descLower.includes('spill') || descLower.includes('fuel leak')) {
    hazardType = "Oil Spill";
    severity = "Critical";
    confidence = true; // Clear keyword match
  } else if (descLower.includes('dead') || descLower.includes('toxic') || descLower.includes('algae') || descLower.includes('bloom')) {
    hazardType = "Water Pollution";
    severity = "High";
    confidence = true;
  } else if (descLower.includes('plastic') || descLower.includes('garbage') || descLower.includes('trash') || descLower.includes('debris')) {
    hazardType = "Plastic Debris";
    severity = "Standard";
    confidence = true;
  } else if (descLower.includes('danger') || descLower.includes('alert') || descLower.includes('storm')) {
    hazardType = "Marine Alert";
    severity = "High";
  }

  return { aiType: hazardType, aiSeverity: severity, confidence };
};

// @desc    Get all reports (with optional filtering)
// @route   GET /api/reports
exports.getReports = async (req, res) => {
  try {
    let query = { status: { $in: ["approved", "Active"] } };
    const { hazardType, severity } = req.query;

    if (hazardType) query.hazardType = hazardType;
    if (severity) query.severity = severity;

    const reports = await Report.find(query)
      .populate('reportedBy', 'name email')
      .sort({ createdAt: -1 });

    res.json(reports);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get nearby reports
// @route   GET /api/reports/nearby
exports.getNearbyReports = async (req, res) => {
  try {
    const { lat, lng, radius, hazardType, severity } = req.query;
    
    if (!lat || !lng) {
      return res.status(400).json({ message: "Latitude and Longitude are required." });
    }

    let query = { status: { $in: ["approved", "Active"] } };
    if (hazardType) query.hazardType = hazardType;
    if (severity) query.severity = severity;

    const radiusInMeters = radius ? radius * 1000 : 10000; // Default 10km

    query.location = {
      $near: {
        $geometry: {
          type: "Point",
          coordinates: [parseFloat(lng), parseFloat(lat)]
        },
        $maxDistance: radiusInMeters
      }
    };

    const reports = await Report.find(query)
      .populate('reportedBy', 'name email')
      .sort({ createdAt: -1 });

    res.json(reports);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// @desc    Create a new report
// @route   POST /api/reports
exports.createReport = async (req, res) => {
  let { hazardType, severity, title, description, lat, lng, locationName } = req.body;

  const parsedLat = parseFloat(lat);
  const parsedLng = parseFloat(lng);

  if (lat === undefined || lat === null || lng === undefined || lng === null || isNaN(parsedLat) || isNaN(parsedLng)) {
    return res.status(400).json({ message: "Invalid or missing coordinates. Latitude and Longitude are required and must be valid numbers." });
  }

  try {
    // 1. Hybrid AI Classification Logic
    const { aiType, aiSeverity, confidence } = classifyHazard(description);

    // Provide default fallback if user provided no data
    if (!hazardType && aiType) hazardType = aiType;
    if (!hazardType && !aiType) hazardType = "Marine Alert";

    if (!severity && aiSeverity) severity = aiSeverity;
    if (!severity && !aiSeverity) severity = "Informational";

    // 2. Override Logic
    // Hazard type should only be overridden if the AI confidence is very high
    if (req.body.hazardType && confidence && aiType && (hazardType !== aiType)) {
      hazardType = aiType;
    }

    // If AI detects a higher severity, override only the severity
    if (req.body.severity && aiSeverity) {
      const userRank = severityRank[req.body.severity] || 1;
      const aiRank = severityRank[aiSeverity] || 1;
      if (aiRank > userRank) {
        severity = aiSeverity;
      }
    }

    let imageUrl = null;
    if (req.file) {
       const result = await uploadToCloudinary(req.file.buffer);
       imageUrl = result.secure_url;
    }

    const report = new Report({
      hazardType,
      severity,
      title,
      description,
      location: {
        type: 'Point',
        coordinates: [parsedLng, parsedLat],
        name: locationName
      },
      imageUrl,
      reportedBy: req.user._id,
    });

    const createdReport = await report.save();
    
    // Automatically populate the reporter name before emitting
    await createdReport.populate('reportedBy', 'name email');

    // Emit socket event for real-time admin update
    const io = req.app.get('io');
    if (io) {
      io.emit('new_pending_report', createdReport);
    }

    res.status(201).json(createdReport);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get stats
// @route   GET /api/reports/stats
exports.getStats = async (req, res) => {
    try {
        const query = { status: { $in: ["approved", "Active"] } };
        const total = await Report.countDocuments(query);
        
        const byType = await Report.aggregate([
          { $match: query },
          { $group: { _id: "$hazardType", count: { $sum: 1 } } }
        ]);
        
        const bySeverity = await Report.aggregate([
          { $match: query },
          { $group: { _id: "$severity", count: { $sum: 1 } } }
        ]);

        // Group reports over time (by Day)
        const recentDays = await Report.aggregate([
          { $match: query },
          {
            $group: {
              _id: {
                $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
              },
              count: { $sum: 1 }
            }
          },
          { $sort: { _id: 1 } },
          { $limit: 14 } // Last 14 days
        ]);

        const stats = {
          total,
          byType: byType.reduce((acc, curr) => { acc[curr._id] = curr.count; return acc; }, {}),
          bySeverity: bySeverity.reduce((acc, curr) => { acc[curr._id] = curr.count; return acc; }, {}),
          overTime: recentDays
        };
    
        res.json(stats);
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
}
