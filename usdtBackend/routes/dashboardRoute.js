const express = require("express");
const router = express.Router();
const dashboardController = require("../controllers/dashboardController");

router.get("/admin", dashboardController.adminDashboard);
router.get("/user/:userId", dashboardController.userDashboard);

module.exports = router;
