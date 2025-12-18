const System = require("../models/System.model");

exports.getSystemData = async (req, res) => {
  try {
    let system = await System.findOne();
    if (!system) {
      system = new System({ tankLevel: null });
      await system.save();
    }
    res.json({
      tankLevel: system.tankLevel,
      lastUpdated: system.lastUpdated,
    });
  } catch (err) {
    console.error("Get system data error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.updateTankLevel = async (req, res) => {
  const { tankLevel } = req.body;

  if (tankLevel !== null && tankLevel !== undefined && (tankLevel < 0 || tankLevel > 100)) {
    return res.status(400).json({ message: "Tank level must be between 0 and 100" });
  }

  try {
    let system = await System.findOne();
    if (!system) {
      system = new System();
    }
    system.tankLevel = tankLevel;
    system.lastUpdated = new Date();
    await system.save();

    res.json({
      message: "Tank level updated",
      tankLevel: system.tankLevel,
      lastUpdated: system.lastUpdated,
    });
  } catch (err) {
    console.error("Update tank level error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

