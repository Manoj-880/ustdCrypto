const lockinModel = require("../models/lockinModel");

const getAllLockins = async () => {
  return await lockinModel.find();
};

const getLockinsByUserId = async (userId) => {
  return await lockinModel.find({ userId });
};

const createLockin = async (data) => {
  const newLockin = new lockinModel(data);
  return await newLockin.save();
};

const deleteLockin = async (id) => {
  return await lockinModel.findByIdAndDelete(id);
};

const updateLockin = async (id, data) => {
  return await lockinModel.findByIdAndUpdate(id, data, { new: true });
};

module.exports = {
  getAllLockins,
  getLockinsByUserId,
  createLockin,
  updateLockin,
  deleteLockin,
};
