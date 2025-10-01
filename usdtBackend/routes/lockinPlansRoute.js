const express = require("express");
const router = express.Router();
const lockinPlansController = require("../controllers/lockinPlanController");

router.get("/", lockinPlansController.getAllLockinPlans);
router.get("/:id", lockinPlansController.getLockinPlanById);
router.post("/", lockinPlansController.createLockinPlan);
router.put("/:id", lockinPlansController.updateLockinPlan);
router.delete("/:id", lockinPlansController.deleteLockinPlan);

module.exports = router;
