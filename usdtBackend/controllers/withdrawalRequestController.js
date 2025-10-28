const withdrawalRequestRepo = require("../repos/withdrawRepo");
const userRepo = require("../repos/userRepo");
const transactionRepo = require("../repos/transactionRepo");
const { sendWithdrawalRequestAlert, sendWithdrawalSuccessEmail, sendWithdrawalRejectionEmail } = require("../services/emailService");

const getAllWithdrawalRequests = async (req, res) => {
  try {
    let requests = await withdrawalRequestRepo.getAllRequests();
    
    // Transform data to match frontend expectations
    const transformedRequests = requests.map(request => ({
      id: request._id,
      userName: request.userId ? `${request.userId.firstName} ${request.userId.lastName}` : 'Unknown User',
      userEmail: request.userId ? request.userId.email : 'N/A',
      usdtQuantity: parseFloat(request.amount),
      walletBalance: request.userId ? parseFloat(request.userId.balance) : 0,
      requestedAt: request.requestDate || request.createdAt,
      walletAddress: request.walletAddress,
      status: request.status || 'PENDING',
      originalData: request // Keep original data for reference
    }));
    
    res.status(200).send({
      success: true,
      message: "Withdrawal requests retrieved successfully",
      data: transformedRequests,
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

const getWithdrawalRequestsByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    
    if (!userId) {
      return res.status(400).send({
        success: false,
        message: "User ID is required",
      });
    }

    let requests = await withdrawalRequestRepo.getRequestsByUserId(userId);
    
    // Transform data to match frontend expectations
    const transformedRequests = requests.map(request => ({
      id: request._id,
      amount: request.amount,
      walletAddress: request.walletAddress,
      status: request.status || 'PENDING',
      requestDate: request.requestDate || request.createdAt,
      approvedAt: request.approvedAt || null,
      rejectedAt: request.rejectedAt || null,
      notes: request.notes || null,
      originalData: request // Keep original data for reference
    }));
    
    res.status(200).send({
      success: true,
      message: "User withdrawal requests retrieved successfully",
      data: transformedRequests,
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
    const { userId, amount, walletAddress, remarks } = req.body;
    if (!userId || !amount || !walletAddress) {
      return res.status(400).send({
        success: false,
        message: "Missing required fields",
      });
    }

    // Validate amount
    const withdrawalAmount = parseFloat(amount);
    if (isNaN(withdrawalAmount) || withdrawalAmount <= 0) {
      return res.status(400).send({
        success: false,
        message: "Invalid amount",
      });
    }

    // Get user and check balance
    const user = await userRepo.getUserById(userId);
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User not found",
      });
    }

    const userBalance = parseFloat(user.balance);
    if (userBalance < withdrawalAmount) {
      return res.status(400).send({
        success: false,
        message: "Insufficient balance",
        currentBalance: userBalance,
        requiredAmount: withdrawalAmount,
      });
    }

    // Update user balance (subtract withdrawal amount)
    const newBalance = (userBalance - withdrawalAmount).toFixed(2);
    await userRepo.updateUser(userId, { balance: newBalance });

    // Create withdrawal request
    let requestData = {
      userId,
      amount: withdrawalAmount.toFixed(2),
      walletAddress,
      userBalance: newBalance,
      requestDate: new Date(),
      remarks: remarks || null,
    };

    let newRequest = await withdrawalRequestRepo.createRequest(requestData);

    // Create transaction record
    await transactionRepo.createTransaction({
      quantity: withdrawalAmount.toFixed(2),
      date: new Date(),
      userId: userId,
      activeWalleteId: "WITHDRAWAL_REQUEST",
      userWalletId: user.walletId || null,
      transactionId: `WITHDRAWAL-${Date.now()}`,
      type: "withdraw",
      status: "pending",
      description: `Withdrawal request to ${walletAddress}`,
      fee: 0
    });

    // Send withdrawal request alert to admin
    try {
      await sendWithdrawalRequestAlert(
        user.firstName,
        user.email,
        withdrawalAmount.toFixed(2),
        "Standard Plan", // You might want to get this from user's active plan
        new Date().toISOString()
      );
      console.log('Withdrawal request alert sent to admin');
    } catch (emailError) {
      console.error('Failed to send withdrawal request alert:', emailError);
      // Don't fail request creation if email fails
    }

    // Get updated user data
    const updatedUser = await userRepo.getUserById(userId);

    res.status(201).send({
      success: true,
      message: "Withdrawal request created successfully",
      data: {
        request: newRequest,
        updatedUser: updatedUser,
      },
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

const rejectWithdrawalRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const { remarks } = req.body;

    if (!remarks || remarks.trim() === '') {
      return res.status(400).send({
        success: false,
        message: "Remarks are required for rejection",
      });
    }

    const request = await withdrawalRequestRepo.getRequestById(id);
    if (!request) {
      return res.status(404).send({
        success: false,
        message: "Withdrawal request not found",
      });
    }

    if (request.status !== 'PENDING') {
      return res.status(400).send({
        success: false,
        message: "Only pending requests can be rejected",
      });
    }

    // Get user details for email
    const user = await userRepo.getUserById(request.userId);
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User not found",
      });
    }

    // Update request status to rejected
    const updatedRequest = await withdrawalRequestRepo.updateRequest(id, {
      status: 'REJECTED',
      remarks: remarks,
      rejectedAt: new Date(),
    });

    // Send rejection email to user
    try {
      await sendWithdrawalRejectionEmail(
        user.email,
        user.firstName,
        request.amount,
        remarks,
        request.requestDate || request.createdAt
      );
      console.log('Withdrawal rejection email sent to:', user.email);
    } catch (emailError) {
      console.error('Failed to send withdrawal rejection email:', emailError);
      // Don't fail rejection if email fails
    }

    res.status(200).send({
      success: true,
      message: "Withdrawal request rejected successfully",
      data: updatedRequest,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Internal server error",
    });
  }
};

const approveWithdrawalRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const { transactionId } = req.body;

    if (!transactionId || transactionId.trim() === '') {
      return res.status(400).send({
        success: false,
        message: "Transaction ID is required for approval",
      });
    }

    const request = await withdrawalRequestRepo.getRequestById(id);
    if (!request) {
      return res.status(404).send({
        success: false,
        message: "Withdrawal request not found",
      });
    }

    if (request.status !== 'PENDING') {
      return res.status(400).send({
        success: false,
        message: "Only pending requests can be approved",
      });
    }

    // Update request status to approved
    const updatedRequest = await withdrawalRequestRepo.updateRequest(id, {
      status: 'APPROVED',
      transactionId: transactionId,
      approvedAt: new Date(),
    });

    // Send withdrawal success email to user with PDF invoice
    try {
      const user = await userRepo.getUserById(request.userId);
      if (user) {
        // Create transaction data for PDF generation
        const transactionData = {
          quantity: request.amount,
          date: new Date(),
          transactionId: transactionId,
          status: 'completed',
          fee: 0,
          userWalletId: request.walletAddress,
          activeWalleteId: 'WITHDRAWAL'
        };

        // Create withdrawal data for PDF generation
        const withdrawalData = {
          walletAddress: request.walletAddress,
          processingTime: new Date().toISOString()
        };

        await sendWithdrawalSuccessEmail(
          user.email,
          user.firstName,
          request.amount,
          transactionId,
          new Date().toISOString(),
          user, // userData for PDF generation
          transactionData, // transactionData for PDF generation
          withdrawalData // withdrawalData for PDF generation
        );
        console.log('Withdrawal success email with PDF invoice sent to:', user.email);
      }
    } catch (emailError) {
      console.error('Failed to send withdrawal success email:', emailError);
      // Don't fail approval if email fails
    }

    res.status(200).send({
      success: true,
      message: "Withdrawal request approved successfully",
      data: updatedRequest,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Internal server error",
    });
  }
};

const verifyTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const { transactionId } = req.body;

    if (!transactionId || transactionId.trim() === '') {
      return res.status(400).send({
        success: false,
        message: "Transaction ID is required",
      });
    }

    const request = await withdrawalRequestRepo.getRequestById(id);
    if (!request) {
      return res.status(404).send({
        success: false,
        message: "Withdrawal request not found",
      });
    }

    if (request.status !== 'APPROVED') {
      return res.status(400).send({
        success: false,
        message: "Only approved requests can be verified",
      });
    }

    // Check if transaction exists in user's transaction history
    const userTransactions = await transactionRepo.getTransactionsByUserId(request.userId);
    const matchingTransaction = userTransactions.find(tx => 
      tx.transactionId === transactionId || 
      tx.activeWalleteId === transactionId ||
      tx.userWalletId === transactionId
    );

    if (matchingTransaction) {
      // Update request status to completed
      const updatedRequest = await withdrawalRequestRepo.updateRequest(id, {
        status: 'COMPLETED',
        completedAt: new Date(),
      });

      res.status(200).send({
        success: true,
        message: "Transaction verified successfully",
        data: updatedRequest,
      });
    } else {
      res.status(400).send({
        success: false,
        message: "Transaction ID not found in user's transaction history",
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
  getAllWithdrawalRequests,
  getWithdrawalRequestById,
  getWithdrawalRequestsByUserId,
  createWithdrawalRequest,
  deleteWithdrawalRequest,
  rejectWithdrawalRequest,
  approveWithdrawalRequest,
  verifyTransaction,
};
