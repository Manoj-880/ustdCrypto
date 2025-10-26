const lockinPlanRepo = require("../repos/lockinPlanRepo");

const getAllLockinPlans = async (req, res) => {
  try {
    const plans = await lockinPlanRepo.getAllLockinPlans();
    res.status(200).send({
      success: true,
      message: "Lock-in plans fetched successfully",
      data: plans,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Internal server error",
    });
  }
};

const getLockinPlanById = async (req, res) => {
  try {
    const { id } = req.params;
    const plan = await lockinPlanRepo.getLockinPlanById(id);
    if (!plan) {
      return res.status(404).send({
        success: false,
        message: "Lock-in plan not found",
      });
    }
    res.status(200).send({
      success: true,
      message: "Lock-in plan fetched successfully",
      data: plan,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Internal server error",
    });
  }
};

const createLockinPlan = async (req, res) => {
  try {
    const { planName, duration, interestRate, referralBonus, description } = req.body;
    if (!planName || !duration || !interestRate || referralBonus === undefined) {
      return res.status(400).send({
        success: false,
        message: "Plan name, duration, interest rate, and referral bonus are required",
      });
    }
    const newPlan = await lockinPlanRepo.createLockinPlan({
      planName,
      duration,
      interestRate,
      referralBonus: referralBonus || 0,
      description,
    });
    res.status(201).send({
      success: true,
      message: "Lock-in plan created successfully",
      data: newPlan,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Internal server error",
    });
  }
};

const updateLockinPlan = async (req, res) => {
  try {
    const { id } = req.params;
    const { planName, duration, interestRate, referralBonus, description } = req.body;
    const updatedPlan = await lockinPlanRepo.updateLockinPlan(id, {
      planName,
      duration,
      interestRate,
      referralBonus: referralBonus || 0,
      description,
    });
    if (!updatedPlan) {
      return res.status(404).send({
        success: false,
        message: "Lock-in plan not found",
      });
    }
    res.status(200).send({
      success: true,
      message: "Lock-in plan updated successfully",
      data: updatedPlan,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Internal server error",
    });
  }
};

const deleteLockinPlan = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedPlan = await lockinPlanRepo.deleteLockinPlan(id);
    if (!deletedPlan) {
      return res.status(404).send({
        success: false,
        message: "Lock-in plan not found",
      });
    }
    res.status(200).send({
      success: true,
      message: "Lock-in plan deleted successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Internal server error",
    });
  }
};

module.exports = {
  getAllLockinPlans,
  getLockinPlanById,
  createLockinPlan,
  updateLockinPlan,
  deleteLockinPlan,
};
