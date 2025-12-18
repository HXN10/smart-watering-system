const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

require("dotenv").config();

const app = express();
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: false
}));
app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ status: "OK", service: "Smart Watering Backend" });
});

const MONGO_URI = process.env.MONGO_URI || process.env.DATABASE_URL;
if (!MONGO_URI) {
  console.error("ERROR: MONGO_URI environment variable is required");
  console.error("Set MONGO_URI in .env file or as environment variable");
  process.exit(1);
}

mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch(err => {
    console.error("MongoDB connection failed:", err.message);
    console.error("Server cannot start without database connection");
    process.exit(1);
  });

const authRoutes = require("./routes/auth.routes");
app.use("/api", authRoutes);

const plantRoutes = require("./routes/plants.routes");
app.use("/api", plantRoutes);

app.get("/api/admin/db", async (req, res) => {
  const authController = require("./controllers/auth.controller");
  const plantsController = require("./controllers/plants.controller");
  
  try {
    const users = await authController.getUsers();
    const plants = await plantsController.getAllPlants();
    
    res.json({
      message: "MongoDB database contents",
      storage: "MongoDB",
      users,
      plants
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = app;
