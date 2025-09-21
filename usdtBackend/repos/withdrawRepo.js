const withdrawModal = require("../models/withdrawRwquestModal");

const getAllRequests = async () => {
  return await withdrawModal.find();
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
  createRequest,
  deleteRequest,
};
