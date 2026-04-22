const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  hazardType: {
    type: String,
    required: true,
    enum: ["Oil Spill", "Water Pollution", "Marine Alert", "Plastic Debris"],
  },
  severity: {
    type: String,
    required: true,
    enum: ["Critical", "High", "Standard", "Informational"],
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      required: true,
      default: 'Point'
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true
    },
    name: { type: String, required: true },
  },
  imageUrl: {
    type: String,
    default: null,
  },
  status: {
    type: String,
    enum: ["pending", "approved", "rejected", "Active", "Under Review", "Resolved"], 
    default: "pending",
  },
  reportedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
}, { timestamps: true });

// Create a 2dsphere index for location to support $near queries
reportSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Report', reportSchema);
