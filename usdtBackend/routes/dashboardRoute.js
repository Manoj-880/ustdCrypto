const express = require("express");
const router = express.Router();
const dashboardController = require("../controllers/dashboardController");

router.get("/admin", dashboardController.adminDashboard);

module.exports = router;
