const express = require("express");
const router = express.Router();

const { getPlants, addPlant, updatePlant, deletePlant } = require("../controllers/plants.controller");

router.get("/plants", getPlants);
router.post("/plants", addPlant);
router.put("/plants/:id", updatePlant);
router.delete("/plants/:id", deletePlant);

module.exports = router;
