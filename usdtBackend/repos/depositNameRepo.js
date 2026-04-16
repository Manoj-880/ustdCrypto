const depositNameModel = require("../models/depositNameModel");

const getAllDepositNames = async () => {
  return await depositNameModel.find().sort({ createdAt: -1 });
};

const createDepositName = async (data) => {
  return await depositNameModel.create(data);
};

const deleteDepositName = async (id) => {
  return await depositNameModel.findByIdAndDelete(id);
};

module.exports = {
  getAllDepositNames,
  createDepositName,
  deleteDepositName,
};
