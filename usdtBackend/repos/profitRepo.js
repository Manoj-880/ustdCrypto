const profitModel = require("../models/profitModel");

const getAllProfits = async () => {
  return await profitModel.find().populate('userId', 'firstName lastName email');
};

const getProfitsByUserId = async (userId) => {
  return await profitModel.find({ userId }).sort({ claimedAt: -1 });
};

const createProfit = async (data) => {
  const newProfit = new profitModel(data);
  return await newProfit.save();
};

const updateProfit = async (id, data) => {
  return await profitModel.findByIdAndUpdate(id, data, { new: true });
};

const getLastClaimedProfit = async (userId) => {
  return await profitModel.findOne({ 
    userId, 
    status: "CLAIMED" 
  }).sort({ claimedAt: -1 });
};

const getPendingProfit = async (userId) => {
  return await profitModel.findOne({ 
    userId, 
    status: "PENDING" 
  }).sort({ createdAt: -1 });
};

const claimProfit = async (userId, profitId) => {
  return await profitModel.findByIdAndUpdate(
    profitId, 
    { 
      status: "CLAIMED", 
      claimedAt: new Date() 
    }, 
    { new: true }
  );
};

module.exports = {
  getAllProfits,
  getProfitsByUserId,
  createProfit,
  updateProfit,
  getLastClaimedProfit,
  getPendingProfit,
  claimProfit,
};
