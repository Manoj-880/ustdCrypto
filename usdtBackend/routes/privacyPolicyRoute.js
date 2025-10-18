const express = require("express");
const router = express.Router();
const privacyPolicyController = require("../controllers/privacyPolicyController");

// Admin routes
router.get("/admin/all", privacyPolicyController.getAllPrivacyPolicies);
router.post("/admin/create", privacyPolicyController.createPrivacyPolicy);
router.put("/admin/update/:id", privacyPolicyController.updatePrivacyPolicy);
router.delete("/admin/delete/:id", privacyPolicyController.deletePrivacyPolicy);
router.get("/admin/:id", privacyPolicyController.getPrivacyPolicyById);

// User routes
router.get("/latest", privacyPolicyController.getLatestPrivacyPolicy);
router.get("/:id", privacyPolicyController.getPrivacyPolicyById);

module.exports = router;
