const withdrawModal = require("../models/withdrawRwquestModal");

const getAllRequests = async () => {
  return await withdrawModal.find();
};

const getRequestById = async (id) => {
  return await withdrawModal.findById(id);
};

const createRequest = async (data) => {
  const newRequest = new withdrawModal(data);
  return await newRequest.save();
};

const deleteRequest = async (id) => {
  return await withdrawModal.findByIdAndDelete(id);
};

module.exports = {
  getAllRequests,
  getRequestById,
  createRequest,
  deleteRequest,
};
