const express = require("express");
const router = express.Router();
const lockinController = require("../controllers/lockinController");

router.get("/", lockinController.getAllLockins);
router.get("/next-name", lockinController.getNextLockinName);
router.get("/:userId", lockinController.getLockinsByUserId);
router.post("/", lockinController.createLockin);
router.delete("/:id", lockinController.deleteLockin);

module.exports = router;
