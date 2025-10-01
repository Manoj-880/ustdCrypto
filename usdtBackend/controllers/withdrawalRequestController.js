const withdrawalRequestRepo = require("../repos/withdrawRepo");

const getAllWithdrawalRequests = async (req, res) => {
  try {
    let requests = await withdrawalRequestRepo.getAllRequests();
    res.status(200).send({
      success: true,
      message: "Withdrawal requests retrieved successfully",
      data: requests,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Internal server error",
    });
  }
};

const getWithdrawalRequestById = async (req, res) => {
  try {
    const { id } = req.params;
    let request = await withdrawalRequestRepo.getRequestById(id);
    res.status(200).send({
      success: true,
      message: "Withdrawal request retrieved successfully",
      data: request,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Internal server error",
    });
  }
};

const createWithdrawalRequest = async (req, res) => {
  try {
    const { userId, amount, walletAddress } = req.body;
    if (!userId || !amount || !walletAddress) {
      return res.status(400).send({
        success: false,
        message: "Missing required fields",
      });
    }

    let requestData = {
      userId,
      amount,
      walletAddress,
      requestDate: new Date(),
    };

    let newRequest = await withdrawalRequestRepo.createRequest(requestData);
    res.status(201).send({
      success: true,
      message: "Withdrawal request created successfully",
      data: newRequest,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Internal server error",
    });
  }
};

const deleteWithdrawalRequest = async (req, res) => {
  try {
    const { id } = req.params;
    let deletedRequest = await withdrawalRequestRepo.deleteRequest(id);
    if (!deletedRequest) {
      return res.status(404).send({
        success: false,
        message: "Withdrawal request not found",
      });
    }
    res.status(200).send({
      success: true,
      message: "Withdrawal request deleted successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Internal server error",
    });
  }
};

module.exports = {
  getAllWithdrawalRequests,
  getWithdrawalRequestById,
  createWithdrawalRequest,
  deleteWithdrawalRequest,
};
