const express = require("express");
const router = express.Router();
const profitController = require("../controllers/profitController");

router.get("/", profitController.getAllProfits);
router.get("/:userId", profitController.getProfitsByUserId);
router.post("/claim", profitController.claimProfit);
router.post("/generate-daily", profitController.generateDailyProfit);

module.exports = router;
