const lockinPlanModel = require("../models/lockinPlansModel");

const getAllLockinPlans = async () => {
  return await lockinPlanModel.find();
};

const getLockinPlanById = async (id) => {
  return await lockinPlanModel.findById(id);
};

const createLockinPlan = async (data) => {
  const newPlan = new lockinPlanModel(data);
  return await newPlan.save();
};

const updateLockinPlan = async (id, data) => {
  return await lockinPlanModel.findByIdAndUpdate(id, data, { new: true });
};

const deleteLockinPlan = async (id) => {
  return await lockinPlanModel.findByIdAndDelete(id);
};

module.exports = {
  getAllLockinPlans,
  getLockinPlanById,
  createLockinPlan,
  updateLockinPlan,
  deleteLockinPlan,
};
