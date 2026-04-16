const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");

router.post("/add", adminController.createAdmin);
router.put("/update/:id", adminController.updateAdmin);
router.post("/add-balance", adminController.addBalance);
router.get("/deposit-names", adminController.getAllDepositNames);
router.post("/deposit-names", adminController.createDepositName);
router.delete("/deposit-names/:id", adminController.deleteDepositName);

module.exports = router;
