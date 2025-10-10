const express = require("express");
const router = express.Router();
const transferController = require("../controllers/transferController");

router.post("/", transferController.transferToWallet);
router.get("/:userId", transferController.getTransfersByUserId);

module.exports = router;
