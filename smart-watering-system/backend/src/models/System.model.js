const mongoose = require("mongoose");

const systemSchema = new mongoose.Schema({
  tankLevel: {
    type: Number,
    default: null,
    min: 0,
    max: 100,
  },
  lastUpdated: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model("System", systemSchema);

