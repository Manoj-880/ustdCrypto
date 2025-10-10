const Transfer = require("../models/transferModel");

const createTransfer = async (data) => {
  const newTransfer = new Transfer(data);
  return await newTransfer.save();
};

const getTransfersByUserId = async (userId) => {
  return await Transfer.find({
    $or: [{ fromUserId: userId }, { toUserId: userId }]
  }).sort({ createdAt: -1 });
};

const getTransferById = async (id) => {
  return await Transfer.findById(id);
};

module.exports = {
  createTransfer,
  getTransfersByUserId,
  getTransferById,
};
