const express = require("express");
const router = express.Router();
const lockinController = require("../controllers/lockinController");

router.get("/", lockinController.getAllLockins);
router.get("/next-name", lockinController.getNextLockinName);
router.get("/completed/:userId", lockinController.getCompletedLockins); // Must come before /:userId
router.get("/:userId", lockinController.getLockinsByUserId);
router.post("/", lockinController.createLockin);
router.post("/add-to-wallet", lockinController.addToWallet);
router.post("/relock", lockinController.relock);
router.delete("/:id", lockinController.deleteLockin);

module.exports = router;
