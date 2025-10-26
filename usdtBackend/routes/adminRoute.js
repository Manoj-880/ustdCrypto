const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");

router.post("/add", adminController.createAdmin);
router.put("/update/:id", adminController.updateAdmin);
router.post("/add-balance", adminController.addBalance);

module.exports = router;
