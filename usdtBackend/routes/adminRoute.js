const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");

router.post("/add", adminController.createAdmin);
router.put("/update/:id", adminController.updateAdmin);

module.exports = router;
