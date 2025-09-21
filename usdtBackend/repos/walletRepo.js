const walletModel = require("../models/walletModel");

const getAllWallets = async () => {
  return await walletModel.find({});
};

const getWalletById = async (id) => {
  return await walletModel.findById(id);
};

const createWallet = async (walletData) => {
  const newWallet = new walletModel(walletData);
  return await newWallet.save();
};

const updateWallet = async (id, walletData) => {
  return await walletModel.findByIdAndUpdate(id, walletData, { new: true });
};

const deleteWallet = async (id) => {
  return await walletModel.findByIdAndDelete(id);
};

const getActiveWallet = async () => {
  return await walletModel.findOne({ status: "active" });
};

const setAllWalletsInactive = async () => {
  return await walletModel.updateMany({}, { status: "inactive" });
};

const setWalletActive = async (id) => {
  return await walletModel.findByIdAndUpdate(id, { status: "active" }, { new: true });
};

module.exports = {
  getAllWallets,
  getWalletById,
  createWallet,
  updateWallet,
  deleteWallet,
  getActiveWallet,
  setAllWalletsInactive,
  setWalletActive,
};
