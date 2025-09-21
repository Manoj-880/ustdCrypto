const express = require("express");
const router = express.Router();
const walletController = require("../controllers/walletController");

router.get("/", walletController.getAllWallets);
router.get("/active", walletController.getActiveWallet);
router.get("/:id", walletController.getWalletById);
router.post("/", walletController.createWallet);
router.put("/:id", walletController.updateWallet);
router.delete("/:id", walletController.deleteWallet);

module.exports = router;
