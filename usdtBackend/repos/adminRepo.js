const adminModel = require("../models/adminModel");

const getAdminByEmail = async (email) => {
  return await adminModel.findOne({ email });
};

const updateAdminById = async (id, updateData) => {
  return await adminModel.findByIdAndUpdate({ _id: id }, updateData, {
    new: true,
  });
};

const createAdmin = async (adminData) => {
  const newAdmin = new adminModel(adminData);
  return await newAdmin.save();
};

module.exports = {
  getAdminByEmail,
  updateAdminById,
  createAdmin,
};
