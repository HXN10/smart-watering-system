const mongoose = require("mongoose");

const plantSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    index: true, // For faster queries
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  autoWater: {
    type: Boolean,
    default: false,
  },
  sensorData: {
    soilMoisture: {
      type: Number,
      default: null, // null means sensor not connected
      min: 0,
      max: 100,
    },
    tankLevel: {
      type: Number,
      default: null, // null means sensor not connected
      min: 0,
      max: 100,
    },
    lastUpdated: {
      type: Date,
      default: Date.now,
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Plant", plantSchema);

