const express = require("express");
const router = express.Router();

const { getSystemData, updateTankLevel } = require("../controllers/system.controller");

router.get("/system", getSystemData);
router.put("/system/tank", updateTankLevel);

module.exports = router;

