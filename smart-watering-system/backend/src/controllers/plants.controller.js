const Plant = require("../models/Plant.model");

exports.getAllPlants = async () => {
  const plants = await Plant.find({});
  const grouped = {};
  plants.forEach(plant => {
    if (!grouped[plant.userId]) grouped[plant.userId] = [];
    grouped[plant.userId].push({
      id: plant._id.toString(),
      name: plant.name,
      autoWater: plant.autoWater,
      sensorData: plant.sensorData,
    });
  });
  return grouped;
};

const extractUserId = (token) => {
  if (!token || !token.startsWith("token-")) return "demo-user";
  const parts = token.split("-");
  if (parts.length >= 3) {
    return parts.slice(1, -1).join("-");
  }
  return token;
};

exports.getPlants = async (req, res) => {
  const userId = extractUserId(req.headers.authorization);
  
  if (!userId) {
    return res.status(401).json({ message: "Authentication required" });
  }

  try {
    const plants = await Plant.find({ userId });
    res.json(plants.map(plant => ({
      id: plant._id.toString(),
      name: plant.name,
      autoWater: plant.autoWater,
      sensorData: plant.sensorData,
    })));
  } catch (err) {
    console.error("Get plants error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.addPlant = async (req, res) => {
  const userId = extractUserId(req.headers.authorization);
  
  if (!userId) {
    return res.status(401).json({ message: "Authentication required" });
  }

  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ message: "Plant name required" });
  }

  try {
    const plant = new Plant({
      userId,
      name: name.trim(),
      autoWater: false,
      sensorData: {
        soilMoisture: null,
        tankLevel: null,
        lastUpdated: new Date(),
      },
    });
    await plant.save();
    res.status(201).json({ 
      message: "Plant added",
      plant: {
        id: plant._id.toString(),
        name: plant.name,
        autoWater: plant.autoWater,
        sensorData: plant.sensorData,
      }
    });
  } catch (err) {
    console.error("Add plant error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.updatePlant = async (req, res) => {
  const userId = extractUserId(req.headers.authorization);
  
  if (!userId) {
    return res.status(401).json({ message: "Authentication required" });
  }

  const { id } = req.params;
  const { name, autoWater } = req.body;

  try {
    const plant = await Plant.findOne({ _id: id, userId });
    if (!plant) {
      return res.status(404).json({ message: "Plant not found" });
    }

    if (name !== undefined) plant.name = name.trim();
    if (autoWater !== undefined) plant.autoWater = autoWater;
    if (req.body.sensorData) {
      if (req.body.sensorData.soilMoisture !== undefined) {
        plant.sensorData.soilMoisture = req.body.sensorData.soilMoisture;
      }
      if (req.body.sensorData.tankLevel !== undefined) {
        plant.sensorData.tankLevel = req.body.sensorData.tankLevel;
      }
      plant.sensorData.lastUpdated = new Date();
    }

    await plant.save();
    res.json({
      message: "Plant updated",
      plant: {
        id: plant._id.toString(),
        name: plant.name,
        autoWater: plant.autoWater,
        sensorData: plant.sensorData,
      }
    });
  } catch (err) {
    console.error("Update plant error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.deletePlant = async (req, res) => {
  const userId = extractUserId(req.headers.authorization);
  
  if (!userId) {
    return res.status(401).json({ message: "Authentication required" });
  }

  const { id } = req.params;

  try {
    const plant = await Plant.findOneAndDelete({ _id: id, userId });
    if (!plant) {
      return res.status(404).json({ message: "Plant not found" });
    }
    res.json({ message: "Plant deleted" });
  } catch (err) {
    console.error("Delete plant error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
