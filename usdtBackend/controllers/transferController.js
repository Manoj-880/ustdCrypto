const transferRepo = require("../repos/transferRepo");
const userRepo = require("../repos/userRepo");
const transactionRepo = require("../repos/transactionRepo");
const { sendInternalTransferReceivedEmail, sendInternalTransferSentEmail } = require("../services/emailService");

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

    // Generate unique transaction ID for the transfer
    const crypto = require("crypto");
    const transferTransactionId = `TXN${Date.now()}${crypto.randomBytes(4).toString('hex').toUpperCase()}`;

    // Create transaction record for sender (outgoing - debited) FIRST
    const senderTransaction = await transactionRepo.createTransaction({
      quantity: -Math.abs(transferAmount), // Negative for debit
      date: new Date(),
      userId: fromUserId,
      activeWalleteId: "TRANSFER_OUT",
      userWalletId: fromUser.walletId || null,
      type: "TRANSFER_OUT",
      status: "completed",
      description: `Transfer to ${toUser.email}`,
      fee: 0,
      transactionId: `${transferTransactionId}_OUT`
    });
    console.log('✅ Sender transaction created:', senderTransaction._id, 'Amount debited:', -transferAmount);

    // Create transaction record for recipient (incoming - credited) SECOND
    const recipientTransaction = await transactionRepo.createTransaction({
      quantity: Math.abs(transferAmount), // Positive for credit
      date: new Date(),
      userId: toUser._id,
      activeWalleteId: "TRANSFER_IN",
      userWalletId: toUser.walletId || null,
      type: "TRANSFER_IN",
      status: "completed",
      description: `Transfer from ${fromUser.email}`,
      fee: 0,
      transactionId: `${transferTransactionId}_IN`
    });
    console.log('✅ Recipient transaction created:', recipientTransaction._id, 'Amount credited:', transferAmount);

    // Update sender balance (subtract) AFTER transactions are created
    const newSenderBalance = (senderBalance - transferAmount).toFixed(2);
    await userRepo.updateUser(fromUserId, { balance: newSenderBalance });

    // Update recipient balance (add) AFTER transactions are created
    const recipientBalance = parseFloat(toUser.balance);
    const newRecipientBalance = (recipientBalance + transferAmount).toFixed(2);
    await userRepo.updateUser(toUser._id, { balance: newRecipientBalance });

    // Create transfer record with transactionId
    const transferData = {
      fromUserId,
      toUserId: toUser._id,
      amount: transferAmount.toFixed(2),
      recipientEmail,
      status: "COMPLETED",
      transactionId: transferTransactionId, // Add required transactionId
    };

    const newTransfer = await transferRepo.createTransfer(transferData);
    console.log('✅ Transfer record created:', newTransfer._id);

    // Send internal transfer received email to recipient
    try {
      await sendInternalTransferReceivedEmail(
        toUser.email,
        toUser.firstName,
        fromUser.firstName,
        transferAmount.toFixed(2),
        recipientTransaction.transactionId,
        newRecipientBalance
      );
      console.log('Internal transfer received email sent to:', toUser.email);
    } catch (emailError) {
      console.error('Failed to send internal transfer received email:', emailError);
      // Don't fail transfer if email fails
    }

    // Send internal transfer sent email to sender
    try {
      await sendInternalTransferSentEmail(
        fromUser.email,
        fromUser.firstName,
        toUser.firstName,
        transferAmount.toFixed(2),
        senderTransaction.transactionId,
        newSenderBalance
      );
      console.log('Internal transfer sent email sent to:', fromUser.email);
    } catch (emailError) {
      console.error('Failed to send internal transfer sent email:', emailError);
      // Don't fail transfer if email fails
    }

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
