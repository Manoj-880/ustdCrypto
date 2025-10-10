const withdrawModal = require("../models/withdrawRwquestModal");

const getAllRequests = async () => {
  return await withdrawModal.find().populate('userId', 'firstName lastName email balance');
};

const getRequestById = async (id) => {
  return await withdrawModal.findById(id);
};

const getRequestsByUserId = async (userId) => {
  return await withdrawModal.find({ userId }).sort({ createdAt: -1 });
};

const createRequest = async (data) => {
  const newRequest = new withdrawModal(data);
  return await newRequest.save();
};

const deleteRequest = async (id) => {
  return await withdrawModal.findByIdAndDelete(id);
};

const updateRequest = async (id, data) => {
  return await withdrawModal.findByIdAndUpdate(id, data, { new: true });
};

module.exports = {
  getAllRequests,
  getRequestById,
  getRequestsByUserId,
  createRequest,
  deleteRequest,
  updateRequest,
};
