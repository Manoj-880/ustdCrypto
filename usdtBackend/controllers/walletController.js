const walletRepo = require("../repos/walletRepo");

const getAllWallets = async (req, res) => {
  try {
    const wallets = await walletRepo.getAllWallets();
    if (wallets) {
      res.status(200).send({
        success: true,
        message: "Wallets fetched successfully",
        data: wallets,
      });
    } else {
      res.status(200).send({
        success: false,
        message: "No wallets found",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Internal server error",
    });
  }
};

const getWalletById = async (req, res) => {
  try {
    const wallet = await walletRepo.getWalletById(req.params.id);
    if (wallet) {
      res.status(200).send({
        success: true,
        message: "Wallet fetched successfully",
        data: wallet,
      });
    } else {
      res.status(200).send({
        success: false,
        message: "Wallet not found",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Internal server error",
    });
  }
};

const getActiveWallet = async (req, res) => {
  try {
    const wallet = await walletRepo.getActiveWallet();
    if (wallet) {
      res.status(200).send({
        success: true,
        message: "Active wallet fetched successfully",
        data: wallet,
      });
    } else {
      res.status(200).send({
        success: false,
        message: "No active wallet found",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Internal server error",
    });
  }
};

const createWallet = async (req, res) => {
  try {
    const newWallet = await walletRepo.createWallet(req.body);
    if (newWallet) {
      res.status(200).send({
        success: true,
        message: "Wallet created successfully",
        data: newWallet,
      });
    } else {
      res.status(200).send({
        success: false,
        message: "Wallet not created",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Internal server error",
    });
  }
};

const updateWallet = async (req, res) => {
  try {
    // First, set all wallets to inactive
    await walletRepo.setAllWalletsInactive();
    
    // Then, set the specific wallet to active
    const updatedWallet = await walletRepo.setWalletActive(req.params.id);
    
    if (updatedWallet) {
      res.status(200).send({
        success: true,
        message: "Wallet updated successfully",
        data: updatedWallet,
      });
    } else {
      res.status(200).send({
        success: false,
        message: "Wallet not found",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Internal server error",
    });
  }
};

const deleteWallet = async (req, res) => {
  try {
    const deletedWallet = await walletRepo.deleteWallet(req.params.id);
    if (deletedWallet) {
      res.status(200).send({
        success: true,
        message: "Wallet deleted successfully",
      });
    } else {
      res.status(200).send({
        success: false,
        message: "Wallet not found",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Internal server error",
    });
  }
};

module.exports = {
  getAllWallets,
  getWalletById,
  createWallet,
  updateWallet,
  deleteWallet,
  getActiveWallet,
};
