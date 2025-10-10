const transferRepo = require("../repos/transferRepo");
const userRepo = require("../repos/userRepo");
const transactionRepo = require("../repos/transactionRepo");

const transferToWallet = async (req, res) => {
  try {
    const { fromUserId, recipientEmail, amount } = req.body;

    // Validate required fields
    if (!fromUserId || !recipientEmail || !amount) {
      return res.status(400).send({
        success: false,
        message: "Missing required fields: fromUserId, recipientEmail, amount",
      });
    }

    // Validate amount
    const transferAmount = parseFloat(amount);
    if (isNaN(transferAmount) || transferAmount <= 0) {
      return res.status(400).send({
        success: false,
        message: "Invalid amount",
      });
    }

    // Get sender user
    const fromUser = await userRepo.getUserById(fromUserId);
    if (!fromUser) {
      return res.status(404).send({
        success: false,
        message: "Sender user not found",
      });
    }

    // Check if sender has sufficient balance
    const senderBalance = parseFloat(fromUser.balance);
    if (senderBalance < transferAmount) {
      return res.status(400).send({
        success: false,
        message: "Insufficient balance",
        currentBalance: senderBalance,
        requiredAmount: transferAmount,
      });
    }

    // Find recipient user by email
    const toUser = await userRepo.getUserByMail(recipientEmail);
    if (!toUser) {
      return res.status(404).send({
        success: false,
        message: "Recipient user not found with the provided email",
      });
    }

    // Check if trying to transfer to self
    if (fromUserId === toUser._id.toString()) {
      return res.status(400).send({
        success: false,
        message: "Cannot transfer to yourself",
      });
    }

    // Update sender balance (subtract)
    const newSenderBalance = (senderBalance - transferAmount).toFixed(2);
    await userRepo.updateUser(fromUserId, { balance: newSenderBalance });

    // Update recipient balance (add)
    const recipientBalance = parseFloat(toUser.balance);
    const newRecipientBalance = (recipientBalance + transferAmount).toFixed(2);
    await userRepo.updateUser(toUser._id, { balance: newRecipientBalance });

    // Create transfer record
    const transferData = {
      fromUserId,
      toUserId: toUser._id,
      amount: transferAmount.toFixed(2),
      recipientEmail,
      status: "COMPLETED",
      transactionId: `TRANSFER-${Date.now()}-${fromUserId}`,
    };

    const newTransfer = await transferRepo.createTransfer(transferData);

    // Create transaction record for sender (outgoing)
    await transactionRepo.createTransaction({
      quantity: transferAmount.toFixed(2),
      date: new Date(),
      userId: fromUserId,
      activeWalleteId: "TRANSFER_OUT",
      userWalletId: fromUser.walletId || null,
      transactionId: `TRANSFER-${Date.now()}-${fromUserId}`,
      type: "TRANSFER_OUT",
    });

    // Create transaction record for recipient (incoming)
    await transactionRepo.createTransaction({
      quantity: transferAmount.toFixed(2),
      date: new Date(),
      userId: toUser._id,
      activeWalleteId: "TRANSFER_IN",
      userWalletId: toUser.walletId || null,
      transactionId: `TRANSFER-${Date.now()}-${fromUserId}`,
      type: "TRANSFER_IN",
    });

    // Get updated sender user data
    const updatedSender = await userRepo.getUserById(fromUserId);

    res.status(200).send({
      success: true,
      message: "Transfer completed successfully",
      data: {
        transfer: newTransfer,
        updatedUser: updatedSender,
      },
    });
  } catch (error) {
    console.error("Error in transferToWallet:", error);
    res.status(500).send({
      success: false,
      message: "Internal server error",
    });
  }
};

const getTransfersByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    const transfers = await transferRepo.getTransfersByUserId(userId);
    
    res.status(200).send({
      success: true,
      message: "User transfers fetched successfully",
      data: transfers,
    });
  } catch (error) {
    console.error("Error fetching user transfers:", error);
    res.status(500).send({
      success: false,
      message: "Internal server error",
    });
  }
};

module.exports = {
  transferToWallet,
  getTransfersByUserId,
};
