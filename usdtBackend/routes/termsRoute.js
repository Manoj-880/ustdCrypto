const express = require("express");
const router = express.Router();
const termsController = require("../controllers/termsController");

// Admin routes
router.get("/admin/all", termsController.getAllTerms);
router.post("/admin/create", termsController.createTerms);
router.put("/admin/update/:id", termsController.updateTerms);
router.delete("/admin/delete/:id", termsController.deleteTerms);
router.get("/admin/:id", termsController.getTermsById);

// User routes
router.get("/latest", termsController.getLatestTerms);
router.get("/:id", termsController.getTermsById);

module.exports = router;
